// Builds the custom room models as glTF files in public/models.
//
//   npm run models
//
// Each model is authored from simple low-poly parts in the original illustration's palette, at real-world
// size in metres, facing +Z with its base centred on the origin. Parts are merged by material so every
// model is only a handful of draw calls. Material names carry intent for the app (see Model.tsx):
//   '#RRGGBB'             flat colour
//   'glow:#RRGGBB'        self-lit (LEDs, screens)
//   'glass:#RRGGBB:alpha' see-through

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Document, NodeIO } from '@gltf-transform/core';
import { KHRMeshQuantization } from '@gltf-transform/extensions';
import { quantize, weld } from '@gltf-transform/functions';
import { scallopedOval, MIRROR_SIZE } from '../src/components/room/shapes.ts';

type V3 = [number, number, number];
interface Placement { position?: V3; rotation?: V3; scale?: V3 }

class ModelBuilder {
    private parts: { geometry: THREE.BufferGeometry; material: string }[] = [];

    add(geometry: THREE.BufferGeometry, material: string, { position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }: Placement = {}) {
        const matrix = new THREE.Matrix4().compose(
            new THREE.Vector3(...position),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
            new THREE.Vector3(...scale),
        );
        const g = (geometry.index ? geometry.toNonIndexed() : geometry.clone()).applyMatrix4(matrix);
        for (const name of Object.keys(g.attributes)) if (name !== 'position') g.deleteAttribute(name);
        g.computeVertexNormals();
        this.parts.push({ geometry: g, material });
        return this;
    }

    // Box by centre and size
    box(size: V3, position: V3, material: string, rotation?: V3) {
        return this.add(new THREE.BoxGeometry(...size), material, { position, rotation });
    }

    // Box between two corners
    span(from: V3, to: V3, material: string) {
        const size: V3 = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
        return this.box(size, [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2], material);
    }

    rounded(size: V3, radius: number, position: V3, material: string, rotation?: V3) {
        return this.add(new RoundedBoxGeometry(...size, 2, radius), material, { position, rotation });
    }

    // Cylinder whose axis runs along 'y' (default), 'x' or 'z'
    cylinder(radius: number, height: number, position: V3, material: string, { axis = 'y', segments = 16, radiusTop }: { axis?: 'x' | 'y' | 'z'; segments?: number; radiusTop?: number } = {}) {
        const rotation: V3 = axis === 'x' ? [0, 0, Math.PI / 2] : axis === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, 0];
        return this.add(new THREE.CylinderGeometry(radiusTop ?? radius, radius, height, segments), material, { position, rotation });
    }

    // Box of the given cross-section running between two points (rails, legs, slats)
    beam(from: V3, to: V3, width: number, thickness: number, material: string) {
        const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
        const direction = b.clone().sub(a);
        const geometry = new THREE.BoxGeometry(width, direction.length(), thickness);
        geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()));
        return this.add(geometry, material, { position: a.add(b).multiplyScalar(0.5).toArray() as V3 });
    }

    // Tube following a closed loop of points (chair frames)
    loop(points: V3[], radius: number, material: string) {
        const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), true);
        return this.add(new THREE.TubeGeometry(curve, points.length * 3, radius, 6, true), material);
    }

    // Flat outline turned into a surface by mapping each point into 3D (curved or tilted panels)
    panel(outline: THREE.Vector2[], map: (x: number, y: number) => V3, material: string) {
        const geometry = new THREE.ShapeGeometry(new THREE.Shape(outline), 12);
        const position = geometry.getAttribute('position');
        for (let i = 0; i < position.count; i++) position.setXYZ(i, ...map(position.getX(i), position.getY(i)));
        return this.add(geometry, material);
    }

    // Faceted blob, for organic low-poly forms
    blob(radius: number, position: V3, material: string, scale: V3 = [1, 1, 1], rotation: V3 = [0, 0, 0]) {
        return this.add(new THREE.IcosahedronGeometry(radius, 1), material, { position, scale, rotation });
    }

    // Smooth-shaded surface whose triangles are split between materials by a colour function of their position,
    // for patterned coats. Normals are computed on the smooth source so patches join seamlessly.
    patchwork(geometry: THREE.BufferGeometry, colourAt: (p: THREE.Vector3) => string, { position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }: Placement = {}) {
        const matrix = new THREE.Matrix4().compose(
            new THREE.Vector3(...position),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
            new THREE.Vector3(...scale),
        );
        const source = geometry.clone();
        for (const name of Object.keys(source.attributes)) if (name !== 'position') source.deleteAttribute(name);
        source.computeVertexNormals();
        const g = source.toNonIndexed().applyMatrix4(matrix);
        const pos = g.getAttribute('position'), nor = g.getAttribute('normal');
        const groups = new Map<string, { p: number[]; n: number[] }>();
        const centroid = new THREE.Vector3(), v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i += 3) {
            centroid.set(0, 0, 0);
            for (let k = 0; k < 3; k++) centroid.add(v.fromBufferAttribute(pos, i + k));
            const colour = colourAt(centroid.divideScalar(3));
            if (!groups.has(colour)) groups.set(colour, { p: [], n: [] });
            const group = groups.get(colour)!;
            for (let k = 0; k < 3; k++) {
                group.p.push(pos.getX(i + k), pos.getY(i + k), pos.getZ(i + k));
                group.n.push(nor.getX(i + k), nor.getY(i + k), nor.getZ(i + k));
            }
        }
        for (const [colour, { p, n }] of groups) {
            const part = new THREE.BufferGeometry();
            part.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
            part.setAttribute('normal', new THREE.Float32BufferAttribute(n, 3));
            this.parts.push({ geometry: part, material: colour });
        }
        return this;
    }

    async write(file: string) {
        const document = new Document();
        const buffer = document.createBuffer();
        const scene = document.createScene();
        const byMaterial = new Map<string, THREE.BufferGeometry[]>();
        for (const { geometry, material } of this.parts) byMaterial.set(material, [...(byMaterial.get(material) ?? []), geometry]);

        for (const [name, geometries] of byMaterial) {
            const merged = mergeGeometries(geometries)!;
            const [kind, hex, alpha] = name.startsWith('#') ? ['flat', name, '1'] : name.split(':');
            const color = new THREE.Color(hex);
            const material = document.createMaterial(name)
                .setBaseColorFactor([color.r, color.g, color.b, Number(alpha ?? 1)])
                .setRoughnessFactor(1)
                .setMetallicFactor(0);
            if (kind === 'glow') material.setEmissiveFactor([color.r, color.g, color.b]);
            if (kind === 'glass') material.setAlphaMode('BLEND').setDoubleSided(true);

            const position = document.createAccessor().setType('VEC3').setBuffer(buffer)
                .setArray(new Float32Array(merged.getAttribute('position').array));
            const normal = document.createAccessor().setType('VEC3').setBuffer(buffer)
                .setArray(new Float32Array(merged.getAttribute('normal').array));
            const primitive = document.createPrimitive().setAttribute('POSITION', position).setAttribute('NORMAL', normal).setMaterial(material);
            const mesh = document.createMesh(name).addPrimitive(primitive);
            scene.addChild(document.createNode(name).setMesh(mesh));
        }
        await document.transform(weld(), quantize());
        await new NodeIO().registerExtensions([KHRMeshQuantization]).write(file, document);
        console.log(`wrote ${file} (${this.parts.length} parts, ${byMaterial.size} materials)`);
    }
}

// Palette from the original illustration
const C = {
    black: '#070F14', charcoal: '#252E33', slate: '#323E44', steel: '#3D474C', grey: '#505E63',
    silver: '#B3B3B3', light: '#D0D2D3', paper: '#E6E7E8', white: '#FFFFFF',
    cyan: '#80DDE0', pink: '#E7B3B2', red: '#682121', yellow: '#E0D06A', cream: '#F9FFA6', brass: '#D6D88F',
    blueGrey: '#83A1B5',
};

// ---------- Gaming PC: mid-tower, 21 × 46 × 45 cm, glass on the -X side ----------

const pc = new ModelBuilder();
{
    const w = 0.21, h = 0.46, d = 0.45, foot = 0.015;
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => pc.box([0.03, foot, 0.04], [sx * 0.08, foot / 2, sz * 0.19], C.black));
    const y0 = foot, y1 = h;
    pc.span([w / 2 - 0.008, y0, -d / 2], [w / 2, y1, d / 2], C.charcoal);                 // solid side
    pc.span([-w / 2, y1 - 0.012, -d / 2], [w / 2, y1, d / 2], C.slate);                     // top
    pc.span([-w / 2, y0, -d / 2], [w / 2, y0 + 0.012, d / 2], C.charcoal);                  // bottom
    pc.span([-w / 2, y0, -d / 2], [w / 2, y1, -d / 2 + 0.01], C.charcoal);                  // back
    pc.span([-w / 2, y0, d / 2 - 0.014], [w / 2, y1, d / 2], C.steel);                      // front panel
    pc.span([-w / 2 + 0.02, y0 + 0.03, d / 2], [-w / 2 + 0.026, y1 - 0.03, d / 2 + 0.002], `glow:${C.cyan}`); // light strip
    pc.cylinder(0.008, 0.004, [w / 2 - 0.035, y1 - 0.03, d / 2 + 0.002], `glow:${C.pink}`, { axis: 'z' });   // power button
    pc.span([-w / 2, y0 + 0.012, -d / 2 + 0.01], [-w / 2 + 0.004, y1 - 0.012, d / 2 - 0.014], `glass:${C.blueGrey}:0.28`);
    pc.span([-w / 2, y1 - 0.02, -d / 2], [-w / 2 + 0.01, y1 - 0.012, d / 2], C.charcoal);   // glass frame
    pc.span([-w / 2, y0 + 0.012, -d / 2], [-w / 2 + 0.01, y0 + 0.02, d / 2], C.charcoal);

    // Interior, visible through the glass
    pc.span([w / 2 - 0.014, 0.13, -0.2], [w / 2 - 0.008, 0.43, 0.1], C.black);             // motherboard
    pc.span([-w / 2 + 0.006, y0 + 0.012, -d / 2 + 0.01], [w / 2 - 0.008, 0.11, d / 2 - 0.014], C.charcoal); // PSU shroud
    pc.span([-0.04, 0.17, -0.2], [w / 2 - 0.014, 0.205, 0.08], C.slate);                    // GPU
    pc.span([-0.042, 0.18, -0.17], [-0.04, 0.188, 0.05], `glow:${C.cyan}`);
    pc.cylinder(0.042, 0.05, [0.05, 0.34, -0.06], C.grey, { axis: 'x', segments: 20 });    // CPU cooler
    pc.cylinder(0.044, 0.006, [0.022, 0.34, -0.06], `glow:${C.cyan}`, { axis: 'x', segments: 20 });
    for (let i = 0; i < 4; i++) {
        pc.span([0.04, 0.31, 0.02 + i * 0.012], [w / 2 - 0.014, 0.4, 0.026 + i * 0.012], C.slate); // RAM
        pc.span([0.04, 0.4, 0.02 + i * 0.012], [0.05, 0.407, 0.026 + i * 0.012], `glow:${C.cyan}`);
    }
    for (const y of [0.17, 0.29, 0.41]) {                                                    // front intake fans
        pc.box([0.13, 0.11, 0.025], [0, y, d / 2 - 0.03], C.charcoal);
        pc.add(new THREE.TorusGeometry(0.045, 0.006, 6, 20), `glow:${C.cyan}`, { position: [0, y, d / 2 - 0.016] });
        pc.add(new THREE.TorusGeometry(0.045, 0.006, 6, 20), `glow:${C.cyan}`, { position: [-w / 2 + 0.03, y, d / 2 - 0.03], rotation: [0, Math.PI / 2, 0] });
    }
}

// ---------- Pioneer DDJ-400: 48.2 × 5.9 × 27.2 cm, front edge towards +Z ----------

const ddj = new ModelBuilder();
{
    const w = 0.482, d = 0.272, top = 0.05;
    ddj.rounded([w, 0.045, d], 0.008, [0, 0.0225, 0], C.black);
    ddj.span([-w / 2 + 0.008, 0.045, -d / 2 + 0.008], [w / 2 - 0.008, top, d / 2 - 0.008], C.charcoal);
    ddj.span([-0.07, top, -d / 2 + 0.01], [0.07, top + 0.002, d / 2 - 0.01], C.slate);       // mixer section

    for (const side of [-1, 1]) {
        const cx = side * 0.145;
        ddj.cylinder(0.072, 0.012, [cx, top + 0.006, -0.015], C.grey, { segments: 28 });     // jog rim
        ddj.cylinder(0.062, 0.004, [cx, top + 0.014, -0.015], C.slate, { segments: 28 });     // platter
        ddj.cylinder(0.022, 0.004, [cx, top + 0.017, -0.015], C.silver, { segments: 16 });
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                ddj.box([0.022, 0.006, 0.022], [cx - 0.045 + col * 0.03, top + 0.003, 0.088 + row * 0.028], C.red);
            }
        }
        ddj.cylinder(0.011, 0.006, [side * 0.222, top + 0.003, 0.088], `glow:#FFB020`, { segments: 14 }); // cue
        ddj.cylinder(0.011, 0.006, [side * 0.222, top + 0.003, 0.116], `glow:#3BE36E`, { segments: 14 }); // play
        ddj.box([0.005, 0.002, 0.12], [side * 0.228, top + 0.001, -0.04], C.black);           // tempo slot
        ddj.box([0.02, 0.01, 0.011], [side * 0.228, top + 0.005, -0.03], C.silver);
        for (let i = 0; i < 3; i++) ddj.box([0.018, 0.005, 0.009], [cx - 0.035 + i * 0.035, top + 0.0025, -0.115], C.slate);

        // Channel strip: five knobs, a fader and a level meter
        const sx = side * 0.038;
        for (let i = 0; i < 5; i++) {
            ddj.cylinder(0.008, 0.012, [sx, top + 0.008, -0.095 + i * 0.024], C.black, { segments: 12 });
            ddj.cylinder(0.005, 0.002, [sx, top + 0.015, -0.095 + i * 0.024], C.silver, { segments: 12 });
        }
        ddj.box([0.004, 0.002, 0.05], [sx, top + 0.003, 0.06], C.black);
        ddj.box([0.016, 0.012, 0.01], [sx, top + 0.008, side < 0 ? 0.045 : 0.07], C.silver);
        for (let i = 0; i < 5; i++) ddj.box([0.006, 0.002, 0.006], [side * 0.013, top + 0.003, -0.02 - i * 0.009], i < 3 ? 'glow:#3BE36E' : i < 4 ? 'glow:#FFB020' : 'glow:#FF3B30');
    }
    ddj.cylinder(0.012, 0.012, [0, top + 0.008, -0.11], C.black, { segments: 16 });          // browse
    ddj.box([0.07, 0.002, 0.004], [0, top + 0.003, 0.115], C.black);                         // crossfader
    ddj.box([0.01, 0.012, 0.018], [-0.01, top + 0.008, 0.115], C.silver);
}

// ---------- Studio monitor: KRK Rokit 5 style, 19 × 28.7 × 24 cm ----------

const monitor = new ModelBuilder();
{
    const w = 0.19, h = 0.287, d = 0.241;
    monitor.rounded([w, h, d], 0.014, [0, h / 2, 0], C.charcoal);
    monitor.cylinder(0.068, 0.006, [0, 0.105, d / 2 + 0.001], C.black, { axis: 'z', segments: 24 });
    monitor.cylinder(0.056, 0.004, [0, 0.105, d / 2 + 0.004], C.yellow, { axis: 'z', segments: 24, radiusTop: 0.05 });
    monitor.cylinder(0.02, 0.006, [0, 0.105, d / 2 + 0.005], C.black, { axis: 'z', segments: 16 });
    monitor.cylinder(0.03, 0.006, [0, 0.225, d / 2 + 0.001], C.black, { axis: 'z', segments: 20 });
    monitor.add(new THREE.SphereGeometry(0.016, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), C.silver, { position: [0, 0.225, d / 2 + 0.003], rotation: [Math.PI / 2, 0, 0] });
    monitor.box([0.12, 0.012, 0.004], [0, 0.03, d / 2 + 0.001], C.black);
    monitor.cylinder(0.004, 0.003, [0.07, 0.27, d / 2 + 0.002], 'glow:#9EE6FF', { axis: 'z', segments: 8 });
}

// ---------- DJ cabinet: 1 m open unit with records, a subwoofer and a storage bin ----------

const cabinet = new ModelBuilder();
{
    const w = 1.0, h = 0.72, d = 0.45, t = 0.03;
    cabinet.span([-w / 2, 0, -d / 2], [w / 2, h, -d / 2 + 0.01], C.paper);                  // back panel
    cabinet.span([-w / 2, 0, -d / 2], [-w / 2 + t, h, d / 2], C.white);
    cabinet.span([w / 2 - t, 0, -d / 2], [w / 2, h, d / 2], C.white);
    cabinet.span([-t / 2, t, -d / 2], [t / 2, h - t, d / 2], C.white);
    for (const y of [0, h / 2 - t / 2, h - t]) cabinet.span([-w / 2, y, -d / 2], [w / 2, y + t, d / 2], C.white);

    const cubby = { y0: h / 2 + t / 2, y1: h - t, x0: -w / 2 + t, x1: -t / 2 };
    const sleeves = ['#CBDD2A', '#D68A8D', '#E0D06A', '#084F3B', '#4078DD', '#B595A6', '#43104F', '#80DDE0', '#D6D29F', '#682121', '#E79124', '#2A8ABE', '#E7B3B2', '#252E33'];
    sleeves.forEach((color, i) => {
        cabinet.box([0.012, 0.31, 0.32], [cubby.x0 + 0.03 + i * 0.03, cubby.y0 + 0.155, 0], color, [0, 0, i > 11 ? -0.28 : 0]);
    });
    // Face-out record in the top right, leaning against the back
    cabinet.box([0.3, 0.3, 0.01], [w / 4, cubby.y0 + 0.155, -d / 2 + 0.06], '#43104F', [-0.12, 0, 0]);
    cabinet.cylinder(0.06, 0.004, [w / 4, cubby.y0 + 0.16, -d / 2 + 0.07], C.cream, { axis: 'z', segments: 20 });
    // Subwoofer bottom left, fabric bin bottom right
    const lowY = t;
    cabinet.box([0.36, 0.3, 0.34], [-w / 4, lowY + 0.15, 0.0], C.charcoal);
    cabinet.cylinder(0.12, 0.006, [-w / 4, lowY + 0.15, 0.172], C.black, { axis: 'z', segments: 24 });
    cabinet.cylinder(0.1, 0.004, [-w / 4, lowY + 0.15, 0.176], C.grey, { axis: 'z', segments: 24, radiusTop: 0.09 });
    cabinet.rounded([0.38, 0.29, 0.38], 0.02, [w / 4, lowY + 0.145, 0.0], C.blueGrey);
    cabinet.box([0.1, 0.03, 0.004], [w / 4, lowY + 0.24, 0.192], C.grey);
}

// ---------- Magic mirror frame: scalloped oval, 60 × 84 cm ----------

const mirror = new ModelBuilder();
{
    const { rx, ry, border } = MIRROR_SIZE;
    const outer = scallopedOval(rx + border, ry + border);
    outer.holes.push(scallopedOval(rx, ry));
    const frame = new THREE.ExtrudeGeometry(outer, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1, curveSegments: 4 });
    mirror.add(frame, C.brass, { position: [0, ry + border, 0] });
}

// ---------- Deck chair: classic folding beach chair in wood with a striped canvas sling ----------

const deckChair = new ModelBuilder();
{
    const wood = '#CF885E', sides = [-0.27, 0.27];
    for (const x of sides) {
        deckChair.beam([x, 0, 0.42], [x, 0.92, -0.36], 0.03, 0.045, wood);              // main frame
        deckChair.beam([x * 0.9, 0, -0.46], [x * 0.9, 0.52, 0.06], 0.03, 0.04, wood);    // rear leg
        deckChair.beam([x, 0.38, 0.38], [x, 0.4, -0.02], 0.025, 0.03, wood);             // seat rail
    }
    deckChair.beam([-0.29, 0.9, -0.345], [0.29, 0.9, -0.345], 0.035, 0.035, wood);       // crossbars
    deckChair.beam([-0.29, 0.05, 0.4], [0.29, 0.05, 0.4], 0.035, 0.035, wood);
    deckChair.beam([-0.26, 0.42, 0.36], [0.26, 0.42, 0.36], 0.03, 0.03, wood);
    deckChair.beam([-0.25, 0.04, -0.44], [0.25, 0.04, -0.44], 0.03, 0.03, wood);

    // Canvas sling sagging from the top bar to the front bar, in lengthwise stripes
    const sling = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.9, -0.33), new THREE.Vector3(0, 0.55, -0.14), new THREE.Vector3(0, 0.3, 0.08), new THREE.Vector3(0, 0.42, 0.34),
    ]);
    const points = sling.getPoints(10);
    const stripes = 5, width = 0.5;
    for (let i = 0; i < points.length - 1; i++) {
        for (let s = 0; s < stripes; s++) {
            const x = -width / 2 + (s + 0.5) * (width / stripes);
            deckChair.beam([x, points[i].y, points[i].z], [x, points[i + 1].y, points[i + 1].z], width / stripes, 0.01, s % 2 ? C.white : '#2A8ABE');
        }
    }
}

// ---------- Bistro table: round café table, 60 cm across ----------

const bistroTable = new ModelBuilder();
{
    bistroTable.cylinder(0.3, 0.025, [0, 0.7, 0], C.white, { segments: 28 });
    bistroTable.cylinder(0.26, 0.02, [0, 0.68, 0], C.light, { segments: 28 });
    bistroTable.cylinder(0.022, 0.66, [0, 0.35, 0], C.grey, { segments: 10 });
    bistroTable.cylinder(0.2, 0.02, [0, 0.01, 0], C.grey, { segments: 24, radiusTop: 0.18 });
}

// ---------- 27" monitor: 61.4 × 36.8 cm panel on a stand, screen facing +Z ----------
// The display area (59.6 × 33.5 cm, centred 28 cm above the base) is left black for the app to draw onto.

const display = new ModelBuilder();
{
    const w = 0.614, h = 0.368, panelY = 0.28;
    display.rounded([w, h, 0.022], 0.006, [0, panelY, 0], C.charcoal);                       // panel and bezel
    display.box([0.596, 0.335, 0.002], [0, panelY + 0.004, 0.0115], C.black);               // display area
    display.rounded([0.3, 0.2, 0.03], 0.012, [0, panelY - 0.01, -0.024], C.slate);          // rear housing
    display.beam([0, 0.012, -0.07], [0, panelY, -0.04], 0.05, 0.022, C.silver);              // neck
    display.rounded([0.24, 0.012, 0.17], 0.005, [0, 0.006, -0.03], C.silver);               // foot
}

// ---------- Office chair: in the style of a Herman Miller Aeron, mineral grey with translucent mesh ----------

// Squarish rounded outline whose half-width changes from the back/bottom (y = -h) to the front/top (y = +h)
const roundedOutline = (halfWidthLow: number, halfWidthHigh: number, halfHeight: number, steps = 40) => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i < steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const c = Math.cos(t), s = Math.sin(t);
        const y = halfHeight * Math.sign(s) * Math.pow(Math.abs(s), 0.35);
        const half = THREE.MathUtils.lerp(halfWidthLow, halfWidthHigh, (y + halfHeight) / (2 * halfHeight));
        points.push(new THREE.Vector2(half * Math.sign(c) * Math.pow(Math.abs(c), 0.35), y));
    }
    return points;
};

const chair = new ModelBuilder();
{
    const frame = '#BBBDBF', base = '#D0D2D3', dark = C.slate, mesh = 'glass:#4A5157:0.86';

    // Five-star base on casters, gas lift and seat mechanism
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + 0.3;
        const end: V3 = [Math.cos(angle) * 0.33, 0.065, Math.sin(angle) * 0.33];
        chair.beam([0, 0.12, 0], end, 0.04, 0.03, base);
        chair.cylinder(0.03, 0.026, [end[0], 0.03, end[2]], C.charcoal, { axis: 'x', segments: 10 });
    }
    chair.cylinder(0.045, 0.06, [0, 0.12, 0], base, { segments: 14 });
    chair.cylinder(0.034, 0.13, [0, 0.21, 0], dark, { segments: 12 });
    chair.cylinder(0.024, 0.14, [0, 0.33, 0], C.silver, { segments: 12 });
    chair.box([0.24, 0.05, 0.24], [0, 0.415, -0.02], dark);

    // Seat: frame loop with a mesh sling that sags slightly in the middle
    const seatY = 0.47;
    const seat = roundedOutline(0.215, 0.25, 0.23);
    const seatAt = (x: number, y: number): V3 => [x, seatY - 0.018 * (1 - (x / 0.25) ** 2) * (1 - (y / 0.23) ** 2) - (y > 0.15 ? (y - 0.15) * 0.35 : 0), y + 0.01];
    chair.panel(seat, seatAt, mesh);
    chair.loop(seat.map(p => seatAt(p.x, p.y)).map(([x, , z]) => [x, seatY - (z - 0.01 > 0.15 ? (z - 0.01 - 0.15) * 0.35 : 0), z] as V3), 0.016, frame);

    // Back: tapers towards the seat, wraps around the sitter and reclines slightly
    const tilt = 0.2, backBase = 0.53, backHeight = 0.6;
    const back = roundedOutline(0.17, 0.235, backHeight / 2);
    const backAt = (x: number, y: number): V3 => {
        const up = y + backHeight / 2;
        return [x, backBase + Math.cos(tilt) * up, -0.25 - Math.sin(tilt) * up + 0.07 * (x / 0.235) ** 2];
    };
    chair.panel(back, backAt, mesh);
    chair.loop(back.map(p => backAt(p.x, p.y)), 0.018, frame);
    chair.beam([-0.16, backBase + 0.17, -0.27 + 0.05], [0.16, backBase + 0.17, -0.27 + 0.05], 0.05, 0.025, dark);   // lumbar
    chair.beam([0, 0.43, -0.1], [0, backBase + 0.02, -0.25], 0.12, 0.03, dark);                                   // spine

    // Arms
    for (const side of [-1, 1]) {
        chair.beam([side * 0.2, 0.43, -0.12], [side * 0.27, 0.66, -0.04], 0.035, 0.03, frame);
        chair.rounded([0.075, 0.025, 0.26], 0.01, [side * 0.27, 0.675, 0.03], dark);
    }
}

// ---------- Dream journal: an open notebook with a pencil, about 36 × 25 cm open ----------

const notebook = new ModelBuilder();
{
    const w = 0.17, d = 0.24, cover = '#175567';
    notebook.rounded([w * 2 + 0.02, 0.006, d + 0.012], 0.003, [0, 0.003, 0], cover);
    for (const side of [-1, 1]) {
        // Page blocks rising slightly towards the spine
        notebook.add(new THREE.BoxGeometry(w, 0.012, d), '#FFFFFF', { position: [side * (w / 2 + 0.004), 0.011, 0], rotation: [0, 0, side * -0.04] });
        for (let i = 0; i < 9; i++) {
            notebook.box([w - 0.03, 0.0005, 0.0018], [side * (w / 2 + 0.004), 0.0175, -d / 2 + 0.035 + i * 0.022], '#D9D8EC', [0, 0, side * -0.04]);
        }
    }
    // A crescent moon doodle and a ribbon bookmark
    const moon = new THREE.Shape();
    moon.absarc(0, 0, 0.022, Math.PI * 0.3, Math.PI * 1.7, false);
    moon.absarc(0.01, 0, 0.018, Math.PI * 1.55, Math.PI * 0.45, true);
    notebook.add(new THREE.ShapeGeometry(moon), '#21687E', { position: [0.12, 0.0185, -0.07], rotation: [-Math.PI / 2, 0, 0.3] });
    notebook.box([0.008, 0.001, 0.07], [0.005, 0.0185, d / 2 + 0.03], '#E79124', [0, 0.1, 0]);
    // Pencil across the right page
    notebook.add(new THREE.CylinderGeometry(0.0045, 0.0045, 0.15, 6), '#E0D06A', { position: [0.09, 0.023, 0.05], rotation: [0, 0.5, Math.PI / 2] });
    notebook.add(new THREE.ConeGeometry(0.0045, 0.018, 6), '#DAC4B3', { position: [0.09 + Math.cos(0.5) * 0.084, 0.023, 0.05 - Math.sin(0.5) * 0.084], rotation: [0, 0.5, -Math.PI / 2] });
    notebook.add(new THREE.CylinderGeometry(0.0047, 0.0047, 0.012, 8), '#E7B3B2', { position: [0.09 - Math.cos(0.5) * 0.081, 0.023, 0.05 + Math.sin(0.5) * 0.081], rotation: [0, 0.5, Math.PI / 2] });
}

await Promise.all([
    notebook.write('public/models/dreamJournal.glb'),
    chair.write('public/models/aeronChair.glb'),
    display.write('public/models/monitor27.glb'),
    deckChair.write('public/models/deckChair.glb'),
    bistroTable.write('public/models/bistroTable.glb'),
    pc.write('public/models/pc.glb'),
    ddj.write('public/models/ddj400.glb'),
    monitor.write('public/models/studioMonitor.glb'),
    cabinet.write('public/models/djCabinet.glb'),
    mirror.write('public/models/mirrorFrame.glb'),
]);
