import { Model } from '../Model';
import { MODEL_URLS } from '../modelUrls';
import { Rest } from '../Rest';

// A 1.2 m monstera beside the TV
export function Plant() {
    return (
        <Rest drop={false}>
            <Model url={MODEL_URLS.plant} size={{ height: 1.2 }} position={[2.5, 0, 4.1]} rotation={[0, 0.4, 0]} />
        </Rest>
    );
}

// The Arduino robot from the Electronics section, a 30 cm rover, turned three-quarters to the camera so its profile reads
export function Robot() {
    return (
        <Rest drop={false}>
            <Model url={MODEL_URLS.robot} size={{ width: 0.3 }} position={[1.2, 0, 3.9]} rotation={[0, 1.75, 0]} />
        </Rest>
    );
}
