import { Modal, Button, Card, Spinner } from 'flowbite-react';
import RoomImage from './assets/home.svg?react';
import { generateCarpet } from './Utils';
import { useRef, useEffect, useState } from 'react';
import DiagramViewer from './components/DiagramViewer';
import SecurityCameraViewer from './components/SecurityCameraViewer';
import DreamSentimentChart from './components/DreamSentimentChart';

// Define portfolio sections with corresponding SVG layers and social links
const portfolioSections: any = {
  "Games": {
    title: "Games",
    icon: <i className="fas fa-gamepad"></i>,
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
    icon: <i className="fas fa-headphones"></i>,
    links: [],
    projects: [
      {
        title: "Zerdazi",
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
        { name: "Instagram", url: "https://instagram.com/mischief.london", icon: "fab fa-instagram" },
          { name: "Resident Advisor", url: "https://ra.co/promoters/157564", icon: "fas fa-globe" }
        ]
      }
    ]
  },
  "Computer": {
    title: "Technical",
    icon: <i className="fas fa-code"></i>,
    projects: [
      {
        title: "Dreams",
        description: "I've kept a dream journal in Google Keep for a few years. I thought it would be interesting to use AI to scan my dreams for sentiment over time, key phrases, recurring themes etc. Using Azure's Text Analysis, I analysed all my dreams, saving the results in a Blob Storage account. Power BI allows me to create graphs and infographics based on this data, giving me insight into my dreams and myself.",
        yearRange: { start: 2020, end: 2020 },
        diagram: "dreams",
        component: "DreamSentimentChart",
        links: [
          { name: "GitHub", url: "https://github.com/yourusername/dreams-analyzer", icon: "fab fa-github" }
        ]
      },
      {
        title: "Security Camera",
        description: "It's possible to build a cheap security system using a Raspberry Pi and its camera module - I set up a live stream with motion detection capabilities, and by hooking this up to other services it can give you a notification when it sees something.",
        yearRange: { start: 2019, end: 2020 },
        diagram: "camera",
        links: [
          { name: "GitHub", url: "https://github.com/yourusername/raspberry-pi-security", icon: "fab fa-github" }
        ],
        component: "SecurityCameraViewer"
      }
    ]
  },
  "LED": {
    title: "LED Screen",
    icon: <i className="fas fa-lightbulb"></i>,
    links: [],
    projects: [
        {
            title: "LED Screen",
            description: "Build video coming soon.",
            yearRange: { start: 2023, end: 2025 },
            instagramEmbed: "https://www.instagram.com/reel/Cxx8ymiIP4P"
        }
    ]
  },
  "MagicMirror": {
    title: "Magic Mirror",
    icon: <i className="fas fa-magic"></i>,
    links: [],
    projects: [
        {
            title: "Magic Mirror",
            description: "Coming soon.",
            yearRange: { start: 2025, end: 2025 }
        }
    ]
  },
  "Music": {
    title: "Music",
    icon: <i className="fas fa-music"></i>,
    links: [],
    projects: [
      {
        title: "Yusuf Zerdazi",
        yearRange: { start: 2006, end: null },
        links: [
          { name: "SoundCloud", url: "https://soundcloud.com/yusufzerdazi", icon: "fab fa-soundcloud" },
          { name: "Spotify", url: "https://open.spotify.com/artist/2RjwqsqhkyyxJ9nupB9UXK?si=fYafrCJdQIuwfZTgdhH-hw", icon: "fab fa-spotify" },
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
  "Values": {
    title: "Values",
    icon: <i className="fas fa-heart"></i>,
    projects: [
      {
        title: "Balance",
        description: "Whether it be diet, beliefs, how much we sleep or the amount we drink, we should strive to not devolve into excess. Excess in any aspect of life, whether it's the amount of time we spend scrolling through Facebook or the number of runs we've been on in a day, will inevitably lead to either dissatisfaction or burnout. We've evolved as humans to maintain homeostasis. We should embrace this natural balance and extend its influence into all aspects of our lives.",
        iconSrc: "values/balance.svg"
      },
      {
        title: "Persistence",
        description: "Improvement can only be achieved through practice, and to change ourselves, we have to challenge ourselves. If we live in comfort, we stagnate, neither evolving nor developing. I think we should always push to the precipice of our abilities in whatever we do, and in this, push it further into the ocean of possibility.",
        iconSrc: "values/persistence.svg"
      },
      {
        title: "Presence",
        description: "Many of us spend too much time either dwelling on the past, or fretting about the future. In reality, the only thing that exists is the present moment. By wasting time like this, we not only miss opportunities, but reduce our capacity to enjoy life.",
        iconSrc: "values/presence.svg"
      },
      {
        title: "Humanity",
        description: "It's easy to dismiss people we disagree with as \"stupid\" or \"bigoted\". I think we should all try to understand where people come from before making judgements about who they are. All people are the result of their genes and upbringing, the people they've interacted with and their life experiences. Because of this, it's impossible to say whether a person is \"right\" or \"wrong\" in how they think.",
        iconSrc: "values/humanity.svg"
      },
      {
        title: "Skepticism",
        description: "It can be hard to realise, given our trust in modern science, that nothing claimed to be known is truly known. Our understanding of the universe has many limitations, not least our own mental capacity. This should be applied not only to philosophical ideas, but to day-to-day interactions, and when encountering anything that's proclaimed as \"true\".",
        iconSrc: "values/skepticism.svg"
      },
      {
        title: "Realism",
        description: "The best we can hope for, and what the scientific method aims to do, is to iteratively improve our model of the universe. This holds not only for traditionally \"scientific\" concepts, but also spiritual ones; if \"supernatural\" phenomena occur, they must be within the fabric of what our universe is capable of, and therefore can be observed and studied like any other.",
        iconSrc: "values/realism.svg"
      },
      {
        title: "Explore",
        description: "We should always be searching for new places, ideas, philosophies and ways of thinking. It is naïve to believe that you have all the answers; every situation you're in, person you meet and concept you encounter can teach you something new.",
        iconSrc: "values/explore.svg"
      },
      {
        title: "Create",
        description: "It's liberating to express yourself. Putting our true experience down on (metaphorical) paper allows us to understand ourselves better, and to fight our individual demons. Not every piece has to be an exploration into your psyche, but they should all contain a small reflection of your soul.",
        iconSrc: "values/create.svg"
      },
      {
        title: "Bond",
        description: "It's hard to concieve of something more complicated and beautiful than the mind. When multiple minds interact, however, they can become more than simply the sum of their parts. Whether it's friendship, professional relationships or romance, the desire to bond and create meaningful connections with likeminded people is a fundamental part of the fabric of society and the individuals within it.",
        iconSrc: "values/bond.svg"
      }
    ]
  },
  "Art": {
    title: "Art",
    icon: <i className="fas fa-paint-brush"></i>,
    projects: [
      {
        title: "Everydays",
        description: "A challenge to create something new every single day, focusing on consistent practice and improvement. Each piece is started and completed within a 24-hour period, pushing me to work efficiently and try new techniques.",
        yearRange: { start: 2017, end: null },
        links: [
          { name: "Instagram", url: "https://instagram.com/everyda.ys", icon: "fab fa-instagram" }
        ]
      }
    ]
  },
  "Cat": {
    title: "Automatic Cat Feeder",
    icon: <i className="fas fa-cat"></i>,
    projects: [
      {
        title: "Automatic Cat Feeder",
        description: "Using a Raspberry Pi (with a camera), an Arduino and a Pringles can, I created an automatic cat food dispenser.\n\nThe Raspberry Pi camera intermittently takes pictures and sends them to Azure Cognitive Services. If it detects a cat, the Pi sends a signal to the Arduino which turns a servo motor, releasing food stored in the Pringles can.\n\nTo avoid overfeeding, it's programmed to only release food twice a day. However, this is made more complicated since we have multiple cats; the second cat might eat food intended for the first. This is already an issue in our household, made evident by their discrepency in size.\n\nFurther research required.",
        yearRange: { start: 2020, end: 2020 },
        diagram: "feeder",
        videoEmbed: "https://www.youtube.com/watch?v=ElRrdRDLgLk",
        links: [
          { name: "GitHub", url: "https://github.com/yourusername/cat-feeder", icon: "fab fa-github" }
        ]
      }
    ]
  }
};

// Add type declaration for Window with instgrm property
declare global {
    interface Window {
        instgrm?: {
            Embeds: {
                process: () => void;
            };
        };
    }
}

// Helper function to format year range for display
const formatYearRange = (yearRange: { start: number, end: number | null }): string => {
  if (!yearRange) return "";
  return yearRange.end === null 
    ? `${yearRange.start}-Present` 
    : yearRange.start === yearRange.end ? `${yearRange.start}` : `${yearRange.start}-${yearRange.end}`;
};

// Add an array of painting images
const paintingImages = [
  '/paintings/Tech2.png',
  '/paintings/Dad\'s Present.png',
  '/paintings/Solace.png',
  '/paintings/2018-01-18  Starry Sky.jpg',
  '/paintings/2018-01-21  Temptation.jpg',
  '/paintings/2018-01-22  Plain.jpg',
  '/paintings/2018-01-29  Bob Ross 2.jpg',
];

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
    const [isLoading] = useState(false);
        
    // Pre-render mobile icons
    const [mobileIcons, setMobileIcons] = useState<{[key: string]: React.ReactNode}>({});
        
    // Add state to store the selected painting
    const [selectedPainting, setSelectedPainting] = useState('');
    
    // Add a loading state specifically for images
    const [imagesLoading, setImagesLoading] = useState(true);
    
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

    // Load Instagram embed script when modal opens
    useEffect(() => {
        // Get current section from state (moved this before using it)
        const currentSection = activeSection ? portfolioSections[activeSection as keyof typeof portfolioSections] : null;
        
        if (openModal && currentSection?.projects?.some((project: any) => project.instagramEmbed)) {
            // Remove existing script if present
            const existingScript = document.getElementById('instagram-embed-script');
            if (existingScript) existingScript.remove();
            
            // Create and load new script
            const script = document.createElement('script');
            script.id = 'instagram-embed-script';
            script.src = '//www.instagram.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
            
            // Execute Instagram embed
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        }
    }, [openModal, activeSection]);

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

    // Choose a random painting on first render
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * paintingImages.length);
        console.log(randomIndex)
        setSelectedPainting(paintingImages[randomIndex]);
    }, []);

    // Separate the painting update logic from the indicators setup
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        // Update wall pattern and paintings that need to change with time
        const wallPattern = generateCarpet(40, 30, time, true);
        const carpetSrc = `data:image/png;base64,${floorPatternRef.current}`;
        const wallSrc = `data:image/png;base64,${wallPattern}`;
        
        const imageElements = svgNode.querySelectorAll('image');
        if (imageElements) {
            imageElements[0].setAttribute('xlink:href', carpetSrc);
            imageElements[1].setAttribute('xlink:href', wallSrc);
            imageElements[3].setAttribute('xlink:href', selectedPainting);
        }
    }, [time, selectedPainting]);

    // Keep the interactive elements setup in a separate effect that doesn't depend on time
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        // First, remove any existing indicators to prevent duplication
        const existingIndicators = svgNode.querySelectorAll('.interactive-indicator');
        existingIndicators.forEach(indicator => {
            indicator.remove();
        });
        
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
                element.addEventListener("click", function() {
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
                
    }, [roomRef.current, isMobile]); // Remove time as a dependency

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

    // Add an effect to handle image loading and hide images
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        // Get all image elements in the SVG
        const imageElements = svgNode.querySelectorAll('image');
        
        // Set visibility based on loading state
        imageElements.forEach(img => {
            img.style.opacity = imagesLoading ? '0' : '1'; 
        });
        
        // Check if painting is selected but not yet loaded
        if (selectedPainting && imagesLoading) {
            const img = new Image();
            img.src = selectedPainting;
            img.onload = () => {
                setImagesLoading(false);
            };
            img.onerror = (err) => {
                console.error("Error loading painting:", err);
                setImagesLoading(false); // Still set to false to prevent infinite loading
            };
        }
    }, [selectedPainting, imagesLoading]);

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
        <div className={`w-full h-full ${isMobile ? 'overflow-auto pb-4' : ''}`}>
            <div className={`w-full h-full ${isMobile ? 'flex flex-col' : ''}`}>
                <div className="flex items-center justify-center h-full relative px-4 pb-4">
                    <RoomImage className={`max-w-full ${isMobile ? 'max-h-[85vh]' : 'h-[calc(100vh-110px)]'} w-auto object-contain ${imagesLoading ? 'images-loading' : ''}`} ref={roomRef} />
                </div>
                
                {/* Mobile navigation icons (visible on smaller screens) */}
                {isMobile && (
                    <div className="md:hidden px-2 overflow-y-auto flex-shrink-0">
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 auto-rows-auto gap-3">
                            {Object.entries(portfolioSections).map(([sectionId, section]: any) => (
                                <div 
                                    key={sectionId}
                                    onClick={() => handleMobileIconClick(sectionId)}
                                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 text-center cursor-pointer transition-all duration-300 portfolio-section-icon"
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
                        <div className="flex flex-col items-center gap-8">
                            {/* Top section: SVG icon centered with accent lines */}
                            <div className="flex items-center w-full max-w-3xl">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-grow"></div>
                                <div className="flex-shrink-0 mx-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800/30">
                                    <svg className="w-40 h-40" viewBox={elementViewBox} preserveAspectRatio="xMidYMid meet">
                                        {clickedElement && <g className="no-hover" dangerouslySetInnerHTML={{ __html: clickedElement.outerHTML }} />}
                                    </svg>
                                </div>
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-grow"></div>
                            </div>
                            
                            {/* Section description and links */}
                            <div className="w-full max-w-3xl">
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
                                                    {currentSection.links.map((link: any, index: number) => (
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
                                            if (!a.yearRange || !b.yearRange) return 0;
                                            const aEndYear = a.yearRange.end === null ? currentYear + 1 : a.yearRange.end;
                                            const bEndYear = b.yearRange.end === null ? currentYear + 1 : b.yearRange.end;
                                            
                                            // If end years are different, sort by them
                                            if (aEndYear !== bEndYear) return bEndYear - aEndYear;
                                            
                                            // If end years are the same, sort by start year (most recent first)
                                            return b.yearRange.start - a.yearRange.start;
                                          })
                                          .map((project, projectIndex) => (
                                            <div key={projectIndex} className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                {/* Left column for icon */}
                                                {project.iconSrc ? <div className="flex justify-center items-center">
                                                   
                                                    <img 
                                                      src={project.iconSrc} 
                                                      alt={`${project.title} icon`}
                                                      className="w-40 h-40"
                                                    />
                                                  
                                                </div>: (
                                                    <></>
                                                  )}
                                                
                                                {/* Right column for content */}
                                                <div className={`${project.iconSrc ? "md:col-span-3" : "md:col-span-4"}`}>
                                                  <div className="flex items-center justify-between mb-2">
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
                                                      {project.videos.map((videoUrl: string, index: number) => (
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
                                                  
                                                  {/* Display YouTube video embed if available */}
                                                  {project.videoEmbed && (
                                                    <div className="mt-6">
                                                      <h4 className="text-md font-medium mb-2 text-gray-900 dark:text-white">
                                                        Demo Video
                                                      </h4>
                                                      <div className="relative pb-[56.25%] h-0 w-full">
                                                        <iframe
                                                          className="absolute top-0 left-0 w-full h-full rounded"
                                                          src={`https://www.youtube.com/embed/${project.videoEmbed.split('v=')[1]}`}
                                                          title={`${project.title} Demo`}
                                                          frameBorder="0"
                                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                          allowFullScreen
                                                        ></iframe>
                                                      </div>
                                                    </div>
                                                  )}
                                                  
                                                  {/* Display Instagram embed if available */}
                                                  {project.instagramEmbed && (
                                                    <div className="mt-6">
                                                      <h4 className="text-md font-medium mb-2 text-gray-900 dark:text-white">
                                                        Instagram
                                                      </h4>
                                                      <div 
                                                        className="instagram-media-renderer mx-auto"
                                                        style={{ maxWidth: '540px' }}
                                                        dangerouslySetInnerHTML={{
                                                          __html: `
                                                            <blockquote 
                                                              class="instagram-media" 
                                                              data-instgrm-captioned 
                                                              data-instgrm-permalink="${project.instagramEmbed}/?utm_source=ig_embed&amp;utm_campaign=loading" 
                                                              data-instgrm-version="14"
                                                              style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"
                                                            ></blockquote>
                                                          `
                                                        }}
                                                      ></div>
                                                    </div>
                                                  )}
                                                  
                                                  {/* Display project-specific links */}
                                                  {project.links && project.links.length > 0 && (
                                                    <div className="mt-4">
                                                      <div className="flex flex-wrap gap-2">
                                                        {project.links.map((link: any, index: number) => (
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
                                              </div>
                                              
                                              {/* Security Camera component */}
                                              {project.component === "SecurityCameraViewer" && (
                                                <SecurityCameraViewer />
                                              )}
                                              
                                              {/* Dream Sentiment Chart component */}
                                              {project.component === "DreamSentimentChart" && (
                                                <DreamSentimentChart />
                                              )}
                                              
                                              {/* Add architecture diagrams */}
                                              {project.diagram && (
                                                <div className="mt-6">
                                                  <DiagramViewer diagram={project.diagram} />
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
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Home;