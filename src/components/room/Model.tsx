import * as THREE from 'three';
import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Vec3 } from './iso';
import { snapToPalette } from './palette';
import { flat } from './materials';

export interface ModelProps {
    url: string;
    // Target size in metres (omit to keep the authored size). The model is scaled uniformly to the tightest of the given dimensions,
    // measured after `orient` and before `rotation`: width along X, height along Y, depth along Z.
    size?: { width?: number; height?: number; depth?: number };
    position?: Vec3;
    // Turn applied after fitting, e.g. to face the model into the room
    rotation?: Vec3;
    // Corrects the source file's own axes (Z-up exports, models facing backwards, etc.)
    orient?: Vec3;
    // Scale each axis to its own target size instead of uniformly
    stretch?: boolean;
    // Flat colour overrides by mesh or material name
    recolor?: Record<string, string>;
    // Keep the file's own origin instead of centring the footprint on it (for authored models with known layouts)
    center?: boolean;
    // Use this material for every mesh instead of flattening (e.g. upholstery)
    material?: THREE.Material;
    // Smooth shading instead of flat facets: true keeps the file's own normals (authored smooth models);
    // a number rebuilds them, smoothing across edges sharper than that crease angle in radians (low-poly downloads)
    smooth?: boolean | number;
    // Colour each face by where it sits on the model: a function of its centre, normalised to 0..1 across the
    // model's bounds on each axis (patterned coats, two-tone parts)
    paint?: (point: THREE.Vector3) => string;
}

const paintFaces = (source: THREE.BufferGeometry, paint: (point: THREE.Vector3) => string) => {
    const geometry = source.index ? source.toNonIndexed() : source.clone();
    geometry.computeBoundingBox();
    const { min, max } = geometry.boundingBox!;
    const span = max.clone().sub(min).max(new THREE.Vector3(1e-6, 1e-6, 1e-6));
    const position = geometry.getAttribute('position');
    const colors = new Float32Array(position.count * 3);
    const centre = new THREE.Vector3(), vertex = new THREE.Vector3(), color = new THREE.Color();
    for (let i = 0; i < position.count; i += 3) {
        centre.set(0, 0, 0);
        for (let k = 0; k < 3; k++) centre.add(vertex.fromBufferAttribute(position, i + k));
        centre.divideScalar(3).sub(min).divide(span);
        color.set(paint(centre));
        for (let k = 0; k < 3; k++) color.toArray(colors, (i + k) * 3);
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
};

// ---------- Flattening to the illustration's look ----------

// Downsampled pixels of each texture, read once
const pixelCache = new WeakMap<THREE.Texture, ImageData | null>();
const readPixels = (texture: THREE.Texture) => {
    if (pixelCache.has(texture)) return pixelCache.get(texture) ?? null;
    const image = texture.image as (CanvasImageSource & { width: number; height: number }) | undefined;
    let pixels: ImageData | null = null;
    if (image?.width) {
        const width = Math.min(image.width, 256), height = Math.min(image.height, 256);
        const ctx = Object.assign(document.createElement('canvas'), { width, height }).getContext('2d', { willReadFrequently: true });
        if (ctx) {
            ctx.drawImage(image, 0, 0, width, height);
            pixels = ctx.getImageData(0, 0, width, height);
        }
    }
    pixelCache.set(texture, pixels);
    return pixels;
};

// One colour per triangle: the texture sampled at the triangle's centre, or the material colour,
// pulled onto the illustration palette. Cached per source geometry and material.
const bakeCache = new WeakMap<THREE.BufferGeometry, WeakMap<THREE.Material, THREE.BufferGeometry>>();
const bakeFaceColors = (source: THREE.BufferGeometry, material: THREE.MeshStandardMaterial) => {
    let byMaterial = bakeCache.get(source);
    if (!byMaterial) bakeCache.set(source, byMaterial = new WeakMap());
    const cached = byMaterial.get(material);
    if (cached) return cached;

    const geometry = source.index ? source.toNonIndexed() : source.clone();
    const count = geometry.getAttribute('position').count;
    const colors = new Float32Array(count * 3);
    const uv = geometry.getAttribute('uv');
    const map = material.map;
    const pixels = map && uv ? readPixels(map) : null;
    if (map) map.updateMatrix();

    const color = new THREE.Color();
    const point = new THREE.Vector2();
    for (let i = 0; i < count; i += 3) {
        color.copy(material.color ?? new THREE.Color('#ffffff'));
        if (pixels && uv) {
            point.set((uv.getX(i) + uv.getX(i + 1) + uv.getX(i + 2)) / 3, (uv.getY(i) + uv.getY(i + 1) + uv.getY(i + 2)) / 3);
            point.applyMatrix3(map!.matrix);
            const x = Math.min(pixels.width - 1, Math.floor((((point.x % 1) + 1) % 1) * pixels.width));
            const y = Math.min(pixels.height - 1, Math.floor((((point.y % 1) + 1) % 1) * pixels.height));
            const p = (y * pixels.width + x) * 4;
            color.multiply(new THREE.Color().setRGB(pixels.data[p] / 255, pixels.data[p + 1] / 255, pixels.data[p + 2] / 255, THREE.SRGBColorSpace));
        }
        snapToPalette(color);
        for (let v = 0; v < 3; v++) color.toArray(colors, (i + v) * 3);
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    byMaterial.set(material, geometry);
    return geometry;
};

const vertexColored = {
    faceted: new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }),
    smooth: new THREE.MeshLambertMaterial({ vertexColors: true }),
};
const flatCache = new Map<string, THREE.MeshLambertMaterial>();
const flatColor = (hex: string, smooth: boolean) => {
    const key = `${hex}/${smooth}`;
    let material = flatCache.get(key);
    if (!material) flatCache.set(key, material = new THREE.MeshLambertMaterial({ color: hex, flatShading: !smooth }));
    return material;
};

// Smoothing for low-poly models: normals are averaged across neighbouring faces that meet at less than the
// crease angle, so curved surfaces shade smoothly while real edges stay crisp. Cached per source geometry.
const creaseCache = new WeakMap<THREE.BufferGeometry, Map<number, THREE.BufferGeometry>>();
const creased = (geometry: THREE.BufferGeometry, angle: number) => {
    let byAngle = creaseCache.get(geometry);
    if (!byAngle) creaseCache.set(geometry, byAngle = new Map());
    let result = byAngle.get(angle);
    if (!result) byAngle.set(angle, result = toCreasedNormals(geometry, angle));
    return result;
};

// Box-projected texture coordinates for models exported without any, so a material map can tile across them
const ensureUvs = (geometry: THREE.BufferGeometry) => {
    if (geometry.getAttribute('uv')) return;
    geometry.computeBoundingBox();
    const size = geometry.boundingBox!.getSize(new THREE.Vector3());
    const scale = 6 / Math.max(size.x, size.y, size.z);
    const position = geometry.getAttribute('position');
    const normal = geometry.getAttribute('normal');
    const uvs = new Float32Array(position.count * 2);
    for (let i = 0; i < position.count; i++) {
        const nx = Math.abs(normal?.getX(i) ?? 0), ny = Math.abs(normal?.getY(i) ?? 1), nz = Math.abs(normal?.getZ(i) ?? 0);
        const [u, v] = ny >= nx && ny >= nz ? [position.getX(i), position.getZ(i)]
            : nx >= nz ? [position.getZ(i), position.getY(i)] : [position.getX(i), position.getY(i)];
        uvs[i * 2] = u * scale;
        uvs[i * 2 + 1] = v * scale;
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
};

// Swap PBR materials and textures for flat matte faces like the original drawing
const flatten = (mesh: THREE.Mesh, recolor: Record<string, string> | undefined, smooth: boolean) => {
    const source = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
    const tint = recolor?.[mesh.name] ?? recolor?.[source.name];
    if (source.name.startsWith('glow:')) {
        // Authored self-lit parts (see scripts/build-models.ts)
        mesh.material = flat(tint ?? source.name.slice(5));
    } else if (tint) {
        mesh.material = flatColor(tint, smooth);
    } else if (source.transparent || source.alphaTest > 0) {
        // Cut-outs and glass keep their texture and transparency
        mesh.material = new THREE.MeshLambertMaterial({
            color: source.color, map: source.map, transparent: source.transparent, opacity: source.opacity, alphaTest: source.alphaTest, side: source.side,
        });
    } else {
        mesh.geometry = bakeFaceColors(mesh.geometry, source);
        mesh.material = smooth ? vertexColored.smooth : vertexColored.faceted;
    }
};

// Loads a glTF model, flattens its look, sits it on the ground centred on its footprint, and scales it to fit
export function Model({ url, size = {}, position = [0, 0, 0], rotation = [0, 0, 0], orient = [0, 0, 0], stretch = false, center = true, recolor, material, smooth = false, paint }: ModelProps) {
    const { scene } = useGLTF(url);

    const { root, scale, offset } = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse(object => {
            const mesh = object as THREE.Mesh;
            if (!mesh.isMesh) return;
            if (material) {
                ensureUvs(mesh.geometry);
                mesh.material = material;
                // Materials that pattern by position on the model are given its bounds (see patternMaterial)
                const bounds = material.userData.bounds as { min: { value: THREE.Vector3 }; span: { value: THREE.Vector3 } } | undefined;
                if (bounds) {
                    mesh.geometry.computeBoundingBox();
                    const { min, max } = mesh.geometry.boundingBox!;
                    bounds.min.value.copy(min);
                    bounds.span.value.copy(max).sub(min).max(new THREE.Vector3(1e-6, 1e-6, 1e-6));
                }
            }
            else if (paint) {
                mesh.geometry = paintFaces(mesh.geometry, paint);
                mesh.material = smooth !== false ? vertexColored.smooth : vertexColored.faceted;
            }
            else flatten(mesh, recolor, smooth !== false);
            if (typeof smooth === 'number') mesh.geometry = creased(mesh.geometry, smooth);
        });

        const oriented = new THREE.Group();
        oriented.rotation.set(...orient);
        oriented.add(clone);
        oriented.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(oriented);
        const extent = box.getSize(new THREE.Vector3());
        const fits = [
            size.width !== undefined ? size.width / extent.x : Infinity,
            size.height !== undefined ? size.height / extent.y : Infinity,
            size.depth !== undefined ? size.depth / extent.z : Infinity,
        ];
        // Without a target size the model keeps its authored scale
        const uniform = fits.every(fit => !Number.isFinite(fit)) ? 1 : Math.min(...fits);
        const middle = box.getCenter(new THREE.Vector3());
        return {
            root: oriented,
            scale: (stretch ? fits.map(fit => (Number.isFinite(fit) ? fit : uniform)) : [uniform, uniform, uniform]) as Vec3,
            offset: (center ? [-middle.x, -box.min.y, -middle.z] : [0, 0, 0]) as Vec3,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene, size.width, size.height, size.depth, stretch, center, smooth, ...orient]);

    return (
        <group position={position} rotation={rotation}>
            <group scale={scale}>
                <group position={offset}>
                    <primitive object={root} />
                </group>
            </group>
        </group>
    );
}
