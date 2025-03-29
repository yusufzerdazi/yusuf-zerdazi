import { Modal, Tooltip, Button } from 'flowbite-react';
import RoomImage from './assets/home.svg?react';
import { generateCarpet } from './Utils';
import { useRef, useEffect, useState } from 'react';

function Home() {
    const roomRef = useRef<SVGSVGElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const animationRef = useRef<number>();
    const [time, setTime] = useState(0);
    const floorPatternRef = useRef<string>();
    const [clickedLayerId, setClickedLayerId] = useState<string>('');

    // Generate floor pattern once
    useEffect(() => {
        floorPatternRef.current = generateCarpet(500, 500);
    }, []);

    useEffect(() => {
        const animate = () => {
            setTime(prev => prev + 0.001);
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const wallPattern = generateCarpet(40, 30, time, true);
        
        const carpetSrc = `data:image/png;base64,${floorPatternRef.current}`;
        const wallSrc = `data:image/png;base64,${wallPattern}`;
    
        const svgNode = roomRef.current;
        const imageElements = svgNode?.querySelectorAll('image');
        
        imageElements![0].setAttribute('xlink:href', carpetSrc);
        imageElements![1].setAttribute('xlink:href', wallSrc);

        const handleClick = (layerId: string) => {
            setClickedLayerId(layerId);
            setOpenModal(true);
        };

        svgNode?.querySelector("#Layer_6")?.setAttribute("class", "hover:opacity-70 cursor-pointer outline-none");
        svgNode?.querySelector("#Layer_6")?.setAttribute("data-tooltip-target", "tooltip-default");
        svgNode?.querySelector("#Layer_6")?.addEventListener("click", () => handleClick("Layer_6"));
        
        svgNode?.querySelector("#Layer_8")?.setAttribute("class", "hover:opacity-70 cursor-pointer");
        svgNode?.querySelector("#Layer_8")?.setAttribute("data-tooltip-target", "tooltip-default");
        svgNode?.querySelector("#Layer_8")?.addEventListener("click", () => handleClick("Layer_8"));
        
        svgNode?.querySelector("#Layer_9")?.setAttribute("class", "hover:opacity-70 cursor-pointer");
        svgNode?.querySelector("#Layer_9")?.setAttribute("data-tooltip-target", "tooltip-default");
        svgNode?.querySelector("#Layer_9")?.addEventListener("click", () => handleClick("Layer_9"));
        
    }, [time]);

    return <div className='mb-auto w-full p-5'>
        <RoomImage className='mx-auto max-w-screen-xl w-full' ref={roomRef} />
        <div id="tooltip-default" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Tooltip content
            <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <Modal size="7xl" dismissible={true} show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Selected Item</Modal.Header>
            <Modal.Body>
                <div className="flex justify-center">
                    <svg className="w-64 h-64">
                        <use href={`./assets/home.svg#${clickedLayerId}`}></use>
                    </svg>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setOpenModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    </div>
}

export default Home;