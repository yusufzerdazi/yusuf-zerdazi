import { Modal, Tooltip, Button, Card, Spinner } from 'flowbite-react';
import RoomImage from './assets/home.svg?react';
import { generateCarpet } from './Utils';
import { useRef, useEffect, useState, useMemo } from 'react';
import homeIconHref from './assets/home.svg';

// Define portfolio sections with corresponding SVG layers
const portfolioSections = {
  "Games": {
    title: "Games",
    description: "...",
    icon: "🎮"
  },
  "DJ": {
    title: "DJing",
    description: "...",
    icon: "🎧"
  },
  "Computer": {
    title: "Technical",
    description: "Engineering solutions and technical implementations",
    icon: "⚙️"
  },
  "LED": {
    title: "LED Screen",
    description: "...",
    icon: "💡"
  },
  "Music": {
    title: "Music",
    description: "...",
    icon: "🎵"
  },
  "Car": {
    title: "Remote Control Car",
    description: "...",
    icon: "🚗"
  }
};

function Home() {
    const roomRef = useRef<SVGSVGElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const animationRef = useRef<number>();
    const [time, setTime] = useState(0);
    const floorPatternRef = useRef<string>();
    const [clickedElement, setClickedElement] = useState<SVGElement | null>(null);
    const [elementViewBox, setElementViewBox] = useState<string>("0 0 500 500");
    const [activeSection, setActiveSection] = useState<string>("");
    const [tooltipContent, setTooltipContent] = useState<string>("");
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Store SVG elements and viewBoxes for instant access
    const svgElements = useRef<{[key: string]: SVGElement}>({});
    const viewBoxCache = useRef<{[key: string]: string}>({});
    
    // Pre-render mobile icons
    const [mobileIcons, setMobileIcons] = useState<{[key: string]: React.ReactNode}>({});
    
    // Check for mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

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

    // Initial setup and caching of SVG elements
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode || Object.keys(svgElements.current).length > 0) return;
        
        // First, set patterns
        const wallPattern = generateCarpet(40, 30, time, true);
        const carpetSrc = `data:image/png;base64,${floorPatternRef.current}`;
        const wallSrc = `data:image/png;base64,${wallPattern}`;
        
        const imageElements = svgNode.querySelectorAll('image');
        if (imageElements && imageElements.length >= 2) {
            imageElements[0].setAttribute('xlink:href', carpetSrc);
            imageElements[1].setAttribute('xlink:href', wallSrc);
        }
        
        // Now pre-cache SVG elements and their viewBoxes
        const mobileSvgIcons: {[key: string]: React.ReactNode} = {};
        
        Object.keys(portfolioSections).forEach(layerId => {
            const element = svgNode.querySelector(`#${layerId}`);
            if (element) {
                // Store original element for reference
                svgElements.current[layerId] = element as SVGElement;
                
                // Calculate and store viewBox
                try {
                    const bbox = (element as SVGGraphicsElement).getBBox();
                    // Ensure minimum size and add padding
                    const padding = 20;
                    const minWidth = 50;
                    const minHeight = 50;
                    
                    const width = Math.max(bbox.width, minWidth);
                    const height = Math.max(bbox.height, minHeight);
                    
                    viewBoxCache.current[layerId] = 
                        `${bbox.x - padding} ${bbox.y - padding} ${width + padding*2} ${height + padding*2}`;
                        
                    // Pre-clone the element for mobile icons (with proper styling)
                    const clonedElement = element.cloneNode(true) as SVGElement;
                    if (clonedElement.hasAttribute('class')) {
                        clonedElement.removeAttribute('class');
                    }
                    clonedElement.removeAttribute('data-tooltip-target');
                    
                    mobileSvgIcons[layerId] = (
                        <svg className="w-full h-full" viewBox={viewBoxCache.current[layerId]} preserveAspectRatio="xMidYMid meet">
                            <g dangerouslySetInnerHTML={{ __html: clonedElement.outerHTML }} />
                        </svg>
                    );
                    
                } catch (error) {
                    console.error(`Could not compute bbox for ${layerId}`, error);
                }
                
                // Add interactivity
                element.setAttribute("class", "cursor-pointer transition-all duration-300 hover:filter hover:drop-shadow-glow hover:brightness-110");
                element.addEventListener("click", () => handleClick(layerId));
                element.addEventListener("mouseenter", (e) => handleMouseEnter(layerId, e as MouseEvent));
                element.addEventListener("mouseleave", handleMouseLeave);
                element.addEventListener("mousemove", (e) => handleMouseMove(e as MouseEvent));
            }
        });
        
        // Set mobile icons once all are created
        setMobileIcons(mobileSvgIcons);
        
    }, [time]);

    // Effect to update wall pattern animations
    useEffect(() => {
        if (Object.keys(svgElements.current).length === 0) return;
        
        const wallPattern = generateCarpet(40, 30, time, true);
        const wallSrc = `data:image/png;base64,${wallPattern}`;
        
        const svgNode = roomRef.current;
        if (svgNode) {
            const imageElements = svgNode.querySelectorAll('image');
            if (imageElements && imageElements.length >= 2) {
                imageElements[1].setAttribute('xlink:href', wallSrc);
            }
        }
    }, [time]);

    // Handle cleanup of event listeners
    useEffect(() => {
        return () => {
            const svgNode = roomRef.current;
            if (!svgNode) return;
            
            Object.keys(portfolioSections).forEach(layerId => {
                const element = svgNode.querySelector(`#${layerId}`);
                if (element) {
                    element.removeEventListener("click", () => handleClick(layerId));
                    element.removeEventListener("mouseenter", (e) => handleMouseEnter(layerId, e as MouseEvent));
                    element.removeEventListener("mouseleave", handleMouseLeave);
                    element.removeEventListener("mousemove", (e) => handleMouseMove(e as MouseEvent));
                }
            });
        };
    }, []);

    // Optimized click handler
    const handleClick = (layerId: string) => {
        setIsLoading(true);
        setActiveSection(layerId);
        
        // Use precomputed viewBox
        setElementViewBox(viewBoxCache.current[layerId] || "0 0 500 500");
        
        const originalElement = svgElements.current[layerId];
        if (originalElement) {
            // Create a fresh clone with minimal properties
            const clonedElement = originalElement.cloneNode(true) as SVGElement;
            
            // Strip all styling attributes
            if (clonedElement.hasAttribute('class')) {
                clonedElement.removeAttribute('class');
            }
            if (clonedElement.hasAttribute('style')) {
                clonedElement.removeAttribute('style');
            }
            clonedElement.removeAttribute('data-tooltip-target');
            
            setClickedElement(clonedElement);
            
            // Use requestAnimationFrame to prevent UI blocking
            requestAnimationFrame(() => {
                setOpenModal(true);
                setTimeout(() => setIsLoading(false), 100);
            });
        }
    };

    const handleMouseEnter = (layerId: string, event: MouseEvent) => {
        if (portfolioSections[layerId as keyof typeof portfolioSections]) {
            const section = portfolioSections[layerId as keyof typeof portfolioSections];
            setTooltipContent(`${section.icon} ${section.title}`);
            setTooltipPosition({ 
                x: event.clientX, 
                y: event.clientY - 40 
            });
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (showTooltip) {
            setTooltipPosition({ 
                x: event.clientX, 
                y: event.clientY - 40 
            });
        }
    };

    const currentSection = activeSection ? portfolioSections[activeSection as keyof typeof portfolioSections] : null;

    return <div className='mb-auto w-full p-5 relative'>
        <RoomImage className='mx-auto max-w-screen-xl w-full' ref={roomRef} />
        
        {/* Loading overlay */}
        {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <Spinner size="xl" />
            </div>
        )}
        
        {/* Mobile navigation icons (only visible on small screens) */}
        {isMobile && (
            <div className="md:hidden mt-6 px-2">
                <h3 className="text-xl font-medium mb-4 text-center dark:text-white">Portfolio Sections</h3>
                <div className="grid grid-cols-3 gap-3">
                    {Object.entries(portfolioSections).map(([sectionId, section]) => (
                        <div 
                            key={sectionId}
                            onClick={() => handleClick(sectionId)}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md text-center cursor-pointer hover:shadow-lg transition-all portfolio-section-icon"
                        >
                            <div className="h-16 flex items-center justify-center mb-2">
                                {mobileIcons[sectionId] || (
                                    <div className="text-3xl">{section.icon}</div>
                                )}
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{section.title}</h4>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* Custom tooltip (desktop only) */}
        {!isMobile && showTooltip && (
            <div 
                className="fixed z-50 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-200 opacity-90 pointer-events-none transform -translate-x-1/2"
                style={{ 
                    left: tooltipPosition.x, 
                    top: tooltipPosition.y,
                }}
            >
                {tooltipContent}
            </div>
        )}
        
        <Modal 
            size="7xl" 
            dismissible={true} 
            show={openModal} 
            onClose={() => setOpenModal(false)}
            className="portfolio-modal"
        >
            <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
                {currentSection && (
                    <div className="flex items-center text-xl font-semibold">
                        <span className="mr-2 text-2xl">{currentSection.icon}</span>
                        {currentSection.title}
                    </div>
                )}
            </Modal.Header>
            <Modal.Body className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                        <svg className="w-full h-full max-h-80 min-h-60" viewBox={elementViewBox} preserveAspectRatio="xMidYMid meet">
                            {clickedElement && <g className="no-hover" dangerouslySetInnerHTML={{ __html: clickedElement.outerHTML }} />}
                        </svg>
                    </div>
                    <div>
                        {currentSection && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                    About {currentSection.title}
                                </h3>
                                <p className="text-base text-gray-700 dark:text-gray-300">
                                    {currentSection.description}
                                </p>
                                <div className="mt-6">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                        Featured Projects
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <Card>
                                            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                                Project 1
                                            </h5>
                                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                                Brief description of this amazing project that showcases my skills.
                                            </p>
                                            <Button size="sm">
                                                View Project <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                            </Button>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between w-full">
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Close
                    </Button>
                    <Button>
                        See All Projects <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    </div>
}

export default Home;