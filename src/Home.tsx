import { Modal, Tooltip, Button, Card, Spinner } from 'flowbite-react';
import RoomImage from './assets/home.svg?react';
import { generateCarpet } from './Utils';
import { useRef, useEffect, useState, useMemo } from 'react';
import homeIconHref from './assets/home.svg';

// Define portfolio sections with corresponding SVG layers and social links
const portfolioSections = {
  "Games": {
    title: "Games",
    description: "Games I've developed in my spare time, showcasing interactive experiences and creative coding.",
    icon: <i className="fas fa-gamepad"></i>,
    yearRange: { start: 2016, end: 2020 },
    projects: [
      {
        title: "Hitbox",
        description: "Hitbox is a symmetric, multiplayer, browser-based brawler game. Every player has the same abilities and move set, meaning it's purely skillbased.",
        yearRange: { start: 2020, end: null },
        links: [{ name: "Play Online", url: "https://www.hitbox.online/", icon: "fas fa-gamepad" }]
      },
      {
        title: "Text Trek",
        description: "Text Trek is a community-based, AI-driven text based adventure game. Imagine huge persistent worlds spanning centuries, characters finding artifacts from past generations, and thrilling open-ended plotlines with atmospheric artwork.",
        yearRange: { start: 2023, end: null },
        links: [{ name: "Play Online", url: "https://texttrek.z16.web.core.windows.net/", icon: "fas fa-book" }]
      }
    ]
  },
  "DJ": {
    title: "DJ",
    description: "TODO",
    icon: <i className="fas fa-headphones"></i>,
    links: [],
    yearRange: { start: 2017, end: null },
    projects: [
      {
        title: "Zerdazi",
        description: "TODO",
        yearRange: { start: 2017, end: null },
        links: [
          { name: "Instagram", url: "https://instagram.com/zerdazi_music", icon: "fab fa-instagram" },
          { name: "SoundCloud", url: "https://soundcloud.com/zerdazi", icon: "fab fa-soundcloud" }
        ]
      },
      {
        title: "TUSH",
        description: "TUSH is a new music event space (founded in London) seeking to create a fun, inclusive and supportive artistic environment for all our friends from all backgrounds & cultures and of all genders & sexualities to dance, vibe and thrive ✨ We want everyone to feel welcome, including all those who identify as \"They\", \"She\" or \"He\", to bring people together as \"Us\".",
        yearRange: { start: 2024, end: null },
        links: [
          { name: "Instagram", url: "https://instagram.com/tush_space", icon: "fab fa-instagram" },
          { name: "Website", url: "https://tushspace.com", icon: "fas fa-globe" }
        ]
      },
      {
        title: "Mischief",
        description: "Leading the charge with garage and breaks, we explore the grooviest degenerate sounds around. Be prepared to witness some obscene shapes on the dancefloor as we sail further into the night. When the clock strikes twelve, drum'n'bass reigns supreme so have your finger guns at the ready.\n\nHead upstairs and come hang out with us at the rooftop. Chatting is the name of the game and we are there to play. Our crew are well versed in silly behaviour and other general nonsense so keep an eye out for a few wizards in the mischief universe. Amongst all that hubbub we have the finest selection of brain rot activities to get lost in.",
        yearRange: { start: 2025, end: null }, 
        links: [
          { name: "Resident Advisor", url: "https://ra.co/promoters/157564", icon: "fas fa-globe" }
        ]
      }
    ]
  },
  "Computer": {
    title: "Technical",
    description: "Engineering solutions and technical implementations including web applications, backend systems, and more.",
    icon: <i className="fas fa-desktop"></i>,
    links: [
      { name: "GitHub", url: "https://github.com/yusufzerdazi", icon: "fab fa-github" },
      { name: "LinkedIn", url: "https://linkedin.com/in/yusufzerdazi", icon: "fab fa-linkedin" }
    ],
    yearRange: { start: 2013, end: null }
  },
  "LED": {
    title: "LED Screen",
    description: "Interactive LED display projects and visual programming.",
    icon: <i className="fas fa-lightbulb"></i>,
    links: [],
    yearRange: { start: 2018, end: 2020 }
  },
  "Music": {
    title: "Music",
    description: "TODO",
    icon: <i className="fas fa-music"></i>,
    links: [],
    yearRange: { start: 2010, end: null },
    projects: [
      {
        title: "Yusuf Zerdazi",
        description: "TODO",
        yearRange: { start: 2006, end: null },
        links: [
          { name: "SoundCloud", url: "https://soundcloud.com/yusufzerdazi", icon: "fab fa-soundcloud" },
          { name: "Spotify", url: "https://open.spotify.com/artist/yourspotifyid", icon: "fab fa-spotify" },
          { name: "The Truth (Music Video)", url: "https://youtu.be/YR4Qm7I1HHM", icon: "fab fa-youtube" }
        ]
      },
      {
        title: "The Mondays",
        description: "The Mondays were a rock and roll group from Bingham, Nottinghamshire. They performed covers of songs by artists such as Oasis, The Libertines, The Rolling Stones, The Eagles, Led Zeppelin, Lynyrd Skynrd and many more, as well as writing their own material. They were composed of Andrew Hemmings, Devon Adams, Yusuf Zerdazi, Alex Rickells and Scott Rice.",
        yearRange: { start: 2010, end: 2013 },
        links: [
          { name: "SoundCloud", url: "https://soundcloud.com/the_mondays", icon: "fab fa-soundcloud" }
        ]
      }
    ]
  },
  "Car": {
    title: "Robotics",
    description: "TODO",
    icon: <i className="fas fa-car"></i>,
    links: [],
    projects: [
      {
        title: "Remote Control Car",
        description: "At AS-Level, I built and programmed a simple, object avoiding robot using Arduino. I used CAD software to design the chassis, and an infrared sensor to detect objects. Since then, I have improved the robot, which is now Bluetooth controlled. I used a servo motor to control the steering, and a Bluetooth receiver paired with an Android app to control.",
        videos: ["https://www.youtube.com/embed/fxrLrlWRNLk", "https://www.youtube.com/embed/0WHfGhkzuQc"],
        yearRange: { start: 2012, end: 2015 }
      },
      {
        title: "SLAM Mapping Robot",
        description: <p>My final year project was to construct a robot which used <a href="https://en.wikipedia.org/wiki/Simultaneous_localization_and_mapping" className="text-blue-600 hover:underline">Simultaneous Localisation and Mapping (SLAM)</a> techniques, to map out rooms in real time. The robot was based on a <a href="https://en.wikipedia.org/wiki/Raspberry_Pi" className="text-blue-600 hover:underline">Raspberry Pi</a>, using <a href="https://en.wikipedia.org/wiki/Lego_Mindstorms" className="text-blue-600 hover:underline">LEGO Mindstorms</a> components for sensor data and wheel movement, and streamed data to and from a remote laptop for control inputs. The project was successful, having major benefits when compared to using raw sensor data to map out rooms, and there is scope for further work to be done by implementing more robust sensors. I attained 80% in this project, which made up half of the final year of my degree.</p>,
        videos: ["./slam.mp4"],
        yearRange: { start: 2016, end: 2017 }
      }
    ]
  },
  "TV": {
    title: "YouTube",
    description: "Video content showcasing my projects, music, and technical demonstrations.",
    icon: <i className="fas fa-tv"></i>,
    links: [
      { name: "YouTube", url: "https://www.youtube.com/channel/UCTZsbno68JdiCQbL_6sjdzg", icon: "fab fa-youtube" }
    ],
    yearRange: { start: 2014, end: null }
  }
};

// Helper function to format year range for display
const formatYearRange = (yearRange: { start: number, end: number | null }): string => {
  if (!yearRange) return "";
  return yearRange.end === null 
    ? `${yearRange.start}-Present` 
    : `${yearRange.start}-${yearRange.end}`;
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
    const [tooltipContent, setTooltipContent] = useState<React.ReactNode>("");
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Store SVG elements and viewBoxes for instant access
    const svgElements = useRef<{[key: string]: SVGElement}>({});
    const viewBoxCache = useRef<{[key: string]: string}>({});
    
    // Pre-render mobile icons
    const [mobileIcons, setMobileIcons] = useState<{[key: string]: React.ReactNode}>({});
    
    // Add this to your existing state variables
    const [interactiveElements, setInteractiveElements] = useState<Array<{id: string, element: SVGElement}>>([]);
    
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

    // Modify the effect that creates the indicators to check for mobile view
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        // First, remove any existing indicators to prevent duplication
        const existingIndicators = svgNode.querySelectorAll('.interactive-indicator');
        existingIndicators.forEach(indicator => {
            indicator.remove();
        });
        
        // First, set patterns
        const wallPattern = generateCarpet(40, 30, time, true);
        const carpetSrc = `data:image/png;base64,${floorPatternRef.current}`;
        const wallSrc = `data:image/png;base64,${wallPattern}`;
        
        const imageElements = svgNode.querySelectorAll('image');
        if (imageElements && imageElements.length >= 2) {
            imageElements[0].setAttribute('xlink:href', carpetSrc);
            imageElements[1].setAttribute('xlink:href', wallSrc);
        }
        
        // Create mobile icons from SVG elements
        const mobileSvgIcons: {[key: string]: React.ReactNode} = {};
        
        // Store references to all interactive elements for later updates
        const elements: Array<{id: string, element: SVGElement}> = [];
        
        // Directly set up event listeners without complex caching
        Object.keys(portfolioSections).forEach((layerId, index) => {
            const element = svgNode.querySelector(`#${layerId}`);
            if (element) {
                // Add to our elements array for position updates
                elements.push({
                    id: layerId,
                    element: element as SVGElement
                });
                
                // Create a cloned version of this element for mobile view
                try {
                    const clone = element.cloneNode(true) as SVGElement;
                    const bbox = (element as SVGGraphicsElement).getBBox();
                    
                    // Remove any classes or interaction indicators
                    if (clone.classList) clone.classList.remove('interactive-element', 'cursor-pointer', 'hover:brightness-125');
                    
                    // Use the element's viewBox for mobile icons
                    mobileSvgIcons[layerId] = (
                        <svg viewBox={`${bbox.x - 5} ${bbox.y - 5} ${bbox.width + 10} ${bbox.height + 10}`} className="h-full w-full">
                            <g dangerouslySetInnerHTML={{ __html: clone.outerHTML }} />
                        </svg>
                    );
                } catch (err) {
                    console.error(`Error creating mobile icon for ${layerId}:`, err);
                }
                
                // Add a simple class for interactivity
                element.setAttribute("class", "cursor-pointer interactive-element hover:brightness-125");
                
                // Only add indicators if not in mobile view
                if (!isMobile) {
                    try {
                        const bbox = (element as SVGGraphicsElement).getBBox();
                        
                        // Create a small indicator triangle that will float above the element
                        const indicatorGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        indicatorGroup.setAttribute("class", "interactive-indicator");
                        indicatorGroup.setAttribute("data-for", layerId);
                        
                        const centerX = bbox.x + bbox.width/2;
                        const topY = bbox.y - 10; // Position slightly higher
                        
                        // For triangle shape pointing down, we'll create three points
                        const triangleWidth = 8; // Width of the triangle base
                        const triangleHeight = 6; // Height of the triangle
                        
                        // Define the three points of the triangle (pointing down)
                        const points = `
                            ${centerX - triangleWidth/2},${topY - triangleHeight}
                            ${centerX + triangleWidth/2},${topY - triangleHeight}
                            ${centerX},${topY}
                        `;
                        
                        const indicator = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                        indicator.setAttribute("points", points);
                        indicator.setAttribute("fill", "#808080"); // Gray fill
                        indicator.setAttribute("fill-opacity", "0.8");
                        
                        // Calculate a staggered delay based on the index
                        const staggerDelay = index * 0.2; // 0.2 seconds delay between each triangle
                        indicator.setAttribute("style", `animation-delay: ${staggerDelay}s;`);
                        
                        indicatorGroup.appendChild(indicator);
                        svgNode.appendChild(indicatorGroup);
                    } catch (err) {
                        console.error(`Error creating indicator for ${layerId}:`, err);
                    }
                }
                
                // Add click handler
                element.addEventListener("click", function(e) {
                    // Simple direct click handler
                    setActiveSection(layerId);
                    
                    try {
                        const bbox = (element as SVGGraphicsElement).getBBox();
                        const padding = 20;
                        setElementViewBox(`${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding*2} ${bbox.height + padding*2}`);
                        
                        const clone = element.cloneNode(true) as SVGElement;
                        if (clone.hasAttribute('class')) clone.removeAttribute('class');
                        if (clone.hasAttribute('style')) clone.removeAttribute('style');
                        
                        setClickedElement(clone);
                        setOpenModal(true);
                    } catch (err) {
                        console.error(`Error processing click on ${layerId}:`, err);
                    }
                });
                
                // Add tooltip handlers
                element.addEventListener("mouseenter", function(e) {
                    const evt = e as MouseEvent;
                    const section = portfolioSections[layerId as keyof typeof portfolioSections];
                    
                    setTooltipContent(
                        <div className="flex items-center">
                            <span className="mr-2">{section.icon}</span>
                            <span>{section.title}</span>
                        </div>
                    );
                    
                    setTooltipPosition({
                        x: evt.clientX,
                        y: evt.clientY - 40
                    });
                    
                    setShowTooltip(true);
                });
                
                element.addEventListener("mouseleave", function() {
                    setShowTooltip(false);
                });
                
                element.addEventListener("mousemove", function(e) {
                    const evt = e as MouseEvent;
                    setTooltipPosition({
                        x: evt.clientX,
                        y: evt.clientY - 40
                    });
                });
            }
        });
        
        // Update the state with the created mobile icons
        setMobileIcons(mobileSvgIcons);
        
        // Update the interactive elements
        setInteractiveElements(elements);
        
    }, [roomRef.current, isMobile]); // Add isMobile as a dependency to re-create indicators when mobile status changes

    // Add effect to hide/show indicators when mobile status changes
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        const indicators = svgNode.querySelectorAll('.interactive-indicator');
        
        if (isMobile) {
            // Hide indicators in mobile view
            indicators.forEach(indicator => {
                indicator.setAttribute('style', 'display: none;');
            });
        } else {
            // Show indicators in desktop view
            indicators.forEach(indicator => {
                indicator.removeAttribute('style');
            });
        }
    }, [isMobile]);

    // Effect to update wall pattern animations
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        const wallPattern = generateCarpet(40, 30, time, true);
        const wallSrc = `data:image/png;base64,${wallPattern}`;
        
        const imageElements = svgNode.querySelectorAll('image');
        if (imageElements && imageElements.length >= 2) {
            imageElements[1].setAttribute('xlink:href', wallSrc);
        }
    }, [time]);

    // Simplified mobile icon click handler
    const handleMobileIconClick = (sectionId: string) => {
        setActiveSection(sectionId);
        
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        const element = svgNode.querySelector(`#${sectionId}`);
        if (element) {
            try {
                const bbox = (element as SVGGraphicsElement).getBBox();
                const padding = 20;
                setElementViewBox(`${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding*2} ${bbox.height + padding*2}`);
                
                const clone = element.cloneNode(true) as SVGElement;
                if (clone.hasAttribute('class')) clone.removeAttribute('class');
                if (clone.hasAttribute('style')) clone.removeAttribute('style');
                
                setClickedElement(clone);
                setOpenModal(true);
            } catch (err) {
                console.error(`Error processing mobile click on ${sectionId}:`, err);
            }
        }
    };

    const currentSection = activeSection ? portfolioSections[activeSection as keyof typeof portfolioSections] : null;

    return (
        <div className={`${isMobile ? 'h-auto overflow-auto py-4' : 'h-full flex items-center justify-center overflow-hidden'}`}>
            <div className={`w-full ${isMobile ? 'flex flex-col' : 'max-h-full flex flex-col'}`}>
                <div className={`${isMobile ? '' : 'flex-1'} flex items-center justify-center ${isMobile ? 'mb-6' : 'overflow-hidden'}`}>
                    <RoomImage className='max-w-full max-h-[85vh] w-auto h-auto object-contain' ref={roomRef} />
                </div>
                
                {/* Mobile navigation icons (visible on smaller screens) */}
                {isMobile && (
                    <div className="md:hidden px-2 overflow-y-auto flex-shrink-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-auto gap-3">
                            {Object.entries(portfolioSections).map(([sectionId, section]) => (
                                <div 
                                    key={sectionId}
                                    onClick={() => handleMobileIconClick(sectionId)}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md text-center cursor-pointer hover:shadow-lg transition-all portfolio-section-icon"
                                >
                                    <div className="h-16 flex items-center justify-center mb-2">
                                        {mobileIcons[sectionId] || (
                                            <div className="text-2xl">
                                                {section.icon}
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{section.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Loading overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <Spinner size="xl" />
                    </div>
                )}
                
                {/* Tooltip */}
                {!isMobile && showTooltip && (
                    <div 
                        className="fixed z-50 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-90 pointer-events-none transform -translate-x-1/2"
                        style={{ 
                            left: tooltipPosition.x, 
                            top: tooltipPosition.y
                        }}
                    >
                        {tooltipContent}
                    </div>
                )}
                
                {/* Modal */}
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
                        {/* Top section: SVG icon on left, parent description on right */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Left column: SVG icon */}
                            <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                                {/* Always show the SVG regardless of section */}
                                <svg className="w-full h-full max-h-80 min-h-60" viewBox={elementViewBox} preserveAspectRatio="xMidYMid meet">
                                    {clickedElement && <g className="no-hover" dangerouslySetInnerHTML={{ __html: clickedElement.outerHTML }} />}
                                </svg>
                            </div>
                            
                            {/* Right column: Section description and links */}
                            <div>
                                {currentSection && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            {currentSection.yearRange && (
                                                <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">
                                                    {formatYearRange(currentSection.yearRange)}
                                                </span>
                                            )}
                                            <p className="text-base text-gray-700 dark:text-gray-300">
                                                {currentSection.description}
                                            </p>
                                        </div>
                                        
                                        {/* Social Links */}
                                        {currentSection.links && currentSection.links.length > 0 && (
                                            <div className="mt-4">
                                                <div className="flex space-x-3">
                                                    {currentSection.links.map((link, index) => (
                                                        <a 
                                                            key={index}
                                                            href={link.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                                                            title={link.name}
                                                        >
                                                            <i className={`${link.icon} fa-2x`}></i>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Bottom section: Projects content spanning full width */}
                        {currentSection && (
                            <div className="w-full">
                                {/* Projects for sections with project arrays */}
                                {currentSection.projects && (
                                    <div className="space-y-8">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                           Projects
                                        </h4>
                                        {/* Sort projects by end year, descending (most recent first) */}
                                        {[...currentSection.projects]
                                          .sort((a, b) => {
                                            // Compare end years (current year for "Present")
                                            const currentYear = new Date().getFullYear();
                                            const aEndYear = a.yearRange.end === null ? currentYear + 1 : a.yearRange.end;
                                            const bEndYear = b.yearRange.end === null ? currentYear + 1 : b.yearRange.end;
                                            
                                            // If end years are different, sort by them
                                            if (aEndYear !== bEndYear) return bEndYear - aEndYear;
                                            
                                            // If end years are the same, sort by start year (most recent first)
                                            return b.yearRange.start - a.yearRange.start;
                                          })
                                          .map((project, projectIndex) => (
                                            <div key={projectIndex} className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {project.title}
                                                    </h5>
                                                    {project.yearRange && (
                                                        <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">
                                                            {formatYearRange(project.yearRange)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-base text-gray-700 dark:text-gray-300">
                                                    {project.description}
                                                </div>
                                                
                                                {/* Display videos if available */}
                                                {project.videos && project.videos.length > 0 && (
                                                    <div className="space-y-4 mt-3">
                                                        <h6 className="text-md font-medium text-gray-800 dark:text-gray-200">
                                                            Project Videos
                                                        </h6>
                                                        {project.videos.map((videoUrl, index) => (
                                                            <div key={index} className="relative pb-[56.25%] h-0 w-full">
                                                                <iframe 
                                                                    className="absolute top-0 left-0 w-full h-full rounded"
                                                                    src={videoUrl}
                                                                    title={`${project.title} Video ${index + 1}`}
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                ></iframe>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Display project-specific links */}
                                                {project.links && project.links.length > 0 && (
                                                    <div className="mt-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.links.map((link, index) => (
                                                                <a 
                                                                    key={index}
                                                                    href={link.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                                                                >
                                                                    <i className={`${link.icon} mr-2`}></i>
                                                                    {link.name}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                          ))}
                                    </div>
                                )}
                                
                                {/* Featured Projects for sections without project arrays */}
                                {!currentSection.projects && (
                                    <div>
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
                                )}
                            </div>
                        )}
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
        </div>
    );
}

export default Home;