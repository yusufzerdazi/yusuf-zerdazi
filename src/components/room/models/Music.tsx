import { Model } from '../Model';
import { MODEL_URLS } from '../modelUrls';
import { Rest } from '../Rest';

// The DJ cabinet, a DDJ-400 and a pair of studio monitors, all authored at real size in scripts/build-models.ts.
// Everything faces into the room (+X) from the left-hand wall.
// Height of the authored cabinet, so the gear on top is placed exactly even where nothing settles it (previews)
const CABINET_TOP = 0.72;

export function DjSetup() {
    return (
        <group>
            <Rest drop={false} against="left" gap={0.01}>
                <Model url={MODEL_URLS.djCabinet} position={[0.24, 0, 3.87]} rotation={[0, Math.PI / 2, 0]} />
            </Rest>
            <Rest>
                <Model url={MODEL_URLS.ddj400} position={[0.25, CABINET_TOP, 3.87]} rotation={[0, Math.PI / 2, 0]} />
            </Rest>
            <Rest>
                <Model url={MODEL_URLS.studioMonitor} position={[0.22, CABINET_TOP, 3.5]} rotation={[0, Math.PI / 2 + 0.2, 0]} />
            </Rest>
            <Rest>
                <Model url={MODEL_URLS.studioMonitor} position={[0.22, CABINET_TOP, 4.24]} rotation={[0, Math.PI / 2 - 0.2, 0]} />
            </Rest>
        </group>
    );
}

// A full-size acoustic, about a metre tall, leaning with its headstock against the left-hand wall
export function Guitar() {
    return (
        <Rest against="left" gap={0.002}>
            <group position={[0.3, 0, 2.86]} rotation={[0, 0, 0.2]}>
                <Model url={MODEL_URLS.guitar} size={{ height: 1.02 }} rotation={[0, Math.PI / 2 - 0.3, 0]} recolor={{ 'wood.001': '#E1CCBA' }} />
            </group>
        </Rest>
    );
}
