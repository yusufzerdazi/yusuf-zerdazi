
import { Modal, Tooltip, Button } from 'flowbite-react';
import RoomImage from './assets/home.svg?react';
import { generateCarpet } from './Utils';
import { useRef, useEffect, useState } from 'react';

function Home() {
    const roomRef = useRef<SVGSVGElement>(null);

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const carpetBase64 = generateCarpet();
        const carpetSrc = `data:image/png;base64,${carpetBase64}`;
    
        const svgNode = roomRef.current;
        const imageElement = svgNode?.querySelector('image');
    
        if (imageElement) {
            imageElement.setAttribute('xlink:href', carpetSrc);
        }
        
        svgNode?.querySelector("#Layer_6")?.setAttribute("class", "hover:opacity-70 cursor-pointer outline-none");
        svgNode?.querySelector("#Layer_6")?.setAttribute("data-tooltip-target", "tooltip-default");
        svgNode?.querySelector("#Layer_6")?.addEventListener("click", () => setOpenModal(true));
        svgNode?.querySelector("#Layer_8")?.setAttribute("class", "hover:opacity-70 cursor-pointer");
        svgNode?.querySelector("#Layer_8")?.setAttribute("data-tooltip-target", "tooltip-default");
        svgNode?.querySelector("#Layer_8")?.addEventListener("click", () => setOpenModal(true));
        svgNode?.querySelector("#Layer_9")?.setAttribute("class", "hover:opacity-70 cursor-pointer");
        svgNode?.querySelector("#Layer_9")?.setAttribute("data-tooltip-target", "tooltip-default");
        svgNode?.querySelector("#Layer_9")?.addEventListener("click", () => setOpenModal(true));
    }, []);

    return <div className='mb-auto w-full p-5'>
        <RoomImage className='mx-auto max-w-screen-xl w-full' ref={roomRef} />
        <div id="tooltip-default" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Tooltip content
            <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <Modal size="7xl" dismissible={true} show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>test</Modal.Header>
            <Modal.Body>body</Modal.Body>
            <Modal.Footer>footer</Modal.Footer>
        </Modal>
    </div>
  }

export default Home;