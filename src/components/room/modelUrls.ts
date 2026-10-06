import { useGLTF } from '@react-three/drei';

// Optimised glTF models in public/models; see public/models/CREDITS.md for sources and licences
export const MODEL_URLS = {
    bistroTable: '/models/bistroTable.glb',
    camera: '/models/camera.glb',
    cat: '/models/catLoaf.glb',
    chair: '/models/aeronChair.glb',
    controller: '/models/controller.glb',
    ddj400: '/models/ddj400.glb',
    deckChair: '/models/deckChair.glb',
    desk: '/models/desk.glb',
    djCabinet: '/models/djCabinet.glb',
    dreamJournal: '/models/dreamJournal.glb',
    frame: '/models/frame.glb',
    guitar: '/models/guitar.glb',
    keyboard: '/models/keyboard.glb',
    mirrorFrame: '/models/mirrorFrame.glb',
    monitor: '/models/monitor27.glb',
    pc: '/models/pc.glb',
    pillow: '/models/pillow.glb',
    plant: '/models/plant.glb',
    plantSmall: '/models/plantSmall1.glb',
    robot: '/models/robot.glb',
    sofa: '/models/sofa.glb',
    studioMonitor: '/models/studioMonitor.glb',
    treeDefault: '/models/tree_default.glb',
    treeDetailed: '/models/tree_detailed.glb',
    treeFat: '/models/tree_fat.glb',
    treeOak: '/models/tree_oak.glb',
    tv: '/models/televisionModern.glb',
    tvCabinet: '/models/cabinetTelevision.glb',
};

Object.values(MODEL_URLS).forEach(url => useGLTF.preload(url));
