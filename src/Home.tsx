import { Modal, Spinner } from 'flowbite-react';
import RoomImage from './assets/home.svg?react';
import { generateCarpet } from './Utils';
import { useRef, useEffect, useState } from 'react';
import DiagramViewer from './components/DiagramViewer';
import SecurityCameraViewer from './components/SecurityCameraViewer';
import DreamSentimentChart from './components/DreamSentimentChart';
import { DiagramType } from './config/diagrams';

// TypeScript interfaces
interface YearRange {
  start: number;
  end: number | null;
}

interface ProjectLink {
  name: string;
  url: string;
  icon: string;
  font?: string;
}

interface Project {
  title: string;
  description?: string | React.ReactNode;
  yearRange?: YearRange;
  diagram?: DiagramType;
  component?: string;
  links?: ProjectLink[];
  videos?: string[];
  videoEmbed?: string;
  instagramEmbed?: string;
  iconSrc?: string;
}

interface PortfolioSection {
  title: string;
  icon: React.ReactNode;
  description?: string;
  yearRange?: YearRange;
  projects?: Project[];
}

interface PortfolioSections {
  [key: string]: PortfolioSection;
}

// Define portfolio sections with corresponding SVG layers and social links
const portfolioSections: PortfolioSections = {
  "Dreams": {
    title: "Project: Dream Tracker",
    icon: <i className="fas fa-moon"></i>,
    projects: [
      {
        title: "Dream Tracker",
        description: "I've kept a dream journal in Google Keep for a few years. I thought it would be interesting to use AI to scan my dreams for sentiment over time, key phrases, recurring themes etc. Using Azure's Text Analysis, I analysed all my dreams, saving the results in a Blob Storage account. Power BI allows me to create graphs and infographics based on this data, giving me insight into my dreams and myself.",
        yearRange: { start: 2020, end: 2020 },
        diagram: "dreams",
        component: "DreamSentimentChart",
        links: [
          { name: "GitHub", url: "https://github.com/yusufzerdazi/dream-tracker", icon: "fab fa-github" }
        ]
      }
    ]
  },
  "Security": {
    title: "Project: Security Camera",
    icon: <i className="fas fa-camera"></i>,
    projects: [
      {
        title: "Security Camera",
        description: "It's possible to build a cheap security system using a Raspberry Pi and its camera module - I set up a live stream with motion detection capabilities, and by hooking this up to other services it can give you a notification when it sees something.",
        yearRange: { start: 2019, end: 2020 },
        diagram: "camera",
        component: "SecurityCameraViewer"
      }
    ]
  },
  "Music": {
    title: "Music",
    icon: <i className="fas fa-music"></i>,
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
  "Games": {
    title: "Games",
    icon: <i className="fas fa-gamepad"></i>,
    projects: [
      {
        title: "Hitbox",
        description: "Hitbox is a symmetric, multiplayer, browser-based brawler game. Every player has the same abilities and move set, meaning it's purely skillbased.",
        yearRange: { start: 2020, end: null },
        videos: ["./hitbox.mp4"],
        links: [
          { name: "Play Online", url: "https://www.hitbox.online/", icon: "fas fa-gamepad" },
          { name: "GitHub", url: "https://github.com/yusufzerdazi/hitbox", icon: "fab fa-github" }
        ]
      },
      {
        title: "Text Trek",
        description: "Text Trek is a community-based, AI-driven text based adventure game. Imagine huge persistent worlds spanning centuries, characters finding artifacts from past generations, and thrilling open-ended plotlines with atmospheric artwork.",
        yearRange: { start: 2023, end: null },
        links: [
          { name: "Play Online", url: "https://texttrek.z16.web.core.windows.net/", icon: "fas fa-book" },
          { name: "GitHub", url: "https://github.com/yusufzerdazi/texttrek", icon: "fab fa-github" }
        ]
      }
    ]
  },
  "DJ": {
    title: "DJ",
    icon: <i className="fas fa-headphones"></i>,
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
  "LED": {
    title: "Project: LED Screen",
    icon: <i className="fas fa-lightbulb"></i>,
    projects: [
        {
            title: "LED Screen",
            description: "Build video coming soon.",
            yearRange: { start: 2023, end: 2025 },
            instagramEmbed: "https://www.instagram.com/reel/Cxx8ymiIP4P",
            links: [
              { name: "GitHub", url: "https://github.com/yusufzerdazi/led-screen", icon: "fab fa-github" }
            ]
        }
    ]
  },
  "MagicMirror": {
    title: "Project: Magic Mirror",
    icon: <i className="fas fa-magic"></i>,
    projects: [
        {
            title: "Magic Mirror",
            description: "Coming soon.",
            yearRange: { start: 2025, end: 2025 },
            links: [
              { name: "GitHub", url: "https://github.com/yusufzerdazi/magicmirror", icon: "fab fa-github" }
            ]
        }
    ]
  },
  "Car": {
    title: "Electronics",
    icon: <i className="fas fa-microchip"></i>,
    projects: [
      {
        title: "Remote Control Car",
        description: "At AS-Level, I built and programmed a simple, object avoiding robot using Arduino. I used CAD software to design the chassis, and an infrared sensor to detect objects. Since then, I have improved the robot, which is now Bluetooth controlled. I used a servo motor to control the steering, and a Bluetooth receiver paired with an Android app to control.",
        videos: ["https://www.youtube.com/embed/fxrLrlWRNLk", "https://www.youtube.com/embed/0WHfGhkzuQc"],
        yearRange: { start: 2012, end: 2015 }
      },
      {
        title: "SLAM Mapping Robot",
        description: <p>My final year project was to construct a robot which used <a href="https://en.wikipedia.org/wiki/Simultaneous_localization_and_mapping" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-1 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors">Simultaneous Localisation and Mapping (SLAM)</a> techniques, to map out rooms in real time. The robot was based on a <a href="https://en.wikipedia.org/wiki/Raspberry_Pi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-1 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors">Raspberry Pi</a>, using <a href="https://en.wikipedia.org/wiki/Lego_Mindstorms" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-1 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors">LEGO Mindstorms</a> components for sensor data and wheel movement, and streamed data to and from a remote laptop for control inputs. The project was successful, having major benefits when compared to using raw sensor data to map out rooms, and there is scope for further work to be done by implementing more robust sensors. I attained 80% in this project, which made up half of the final year of my degree.</p>,
        videos: ["./slam.mp4"],
        yearRange: { start: 2016, end: 2017 },
        links: [
          { name: "GitHub", url: "https://github.com/yusufzerdazi/raspberry-pi-robot", icon: "fab fa-github" }
        ]
      }
    ]
  },
  "Cat": {
    title: "Project: Automatic Cat Feeder",
    icon: <i className="fas fa-cat"></i>,
    projects: [
      {
        title: "Automatic Cat Feeder",
        description: "Using a Raspberry Pi (with a camera), an Arduino and a Pringles can, I created an automatic cat food dispenser.\n\nThe Raspberry Pi camera intermittently takes pictures and sends them to Azure Cognitive Services. If it detects a cat, the Pi sends a signal to the Arduino which turns a servo motor, releasing food stored in the Pringles can.\n\nTo avoid overfeeding, it's programmed to only release food twice a day. However, this is made more complicated since we have multiple cats; the second cat might eat food intended for the first. This is already an issue in our household, made evident by their discrepency in size.\n\nFurther research required.",
        yearRange: { start: 2020, end: 2020 },
        diagram: "feeder",
        videoEmbed: "https://www.youtube.com/watch?v=ElRrdRDLgLk"
      }
    ]
  },
  "TicketSlick": {
    title: "TicketSlick",
    icon: <i className="fas fa-ticket"></i>,
    projects: [
      {
        title: "TicketSlick",
        description: "TicketSlick is a tool to help people get tickets to sold out events. Users can subscribe to events, and be notified as soon as resale tickets become available.",
        yearRange: { start: 2020, end: 2025 },
        instagramEmbed: "https://www.instagram.com/p/DM-IqvKgY0v/",
        links: [
          { name: "TicketSlick", url: "https://www.ticketslick.com", icon: "fas fa-ticket", font: "Pacifico" }
        ]
      }
    ]
  },
  "Computer": {
    title: "Websites",
    icon: <i className="fas fa-laptop"></i>,
    projects: [
      {
        title: "Kassita",
        description: "A custom website I created for Kassita's DJ page, featuring her music and performances.",
        yearRange: { start: 2024, end: 2024 },
        videos: ["./Kassita.mp4"],
        links: [
          { name: "Visit Website", url: "https://www.sitasound.com", icon: "fas fa-globe" }
        ]
      }
    ]
  },
  "Values": {
    title: "Values",
    icon: <i className="fas fa-yin-yang"></i>,
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

// Helper function to format titles with Pacifico font for TicketSlick
const formatTitleWithFont = (title: string, sectionId?: string): React.ReactNode => {
  if (sectionId === "TicketSlick" || title.includes("TicketSlick")) {
    // Split the title to find "TicketSlick" and apply Pacifico font
    const parts = title.split(/(TicketSlick)/);
    return (
      <>
        {parts.map((part, index) => 
          part === "TicketSlick" ? (
            <span key={index} style={{ fontFamily: 'Pacifico, cursive' }}>
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  }
  return title;
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

interface HomeProps {
  isMobile: boolean;
}

function Home({ isMobile }: HomeProps) {
    const roomRef = useRef<SVGSVGElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const animationRef = useRef<number>();
    const [time, setTime] = useState(0);
    const floorPatternRef = useRef<string>();
    const [clickedElementId, setClickedElementId] = useState<string>("");
    const [elementViewBox, setElementViewBox] = useState<string>("0 0 500 500");
    const [activeSection, setActiveSection] = useState<string>("");
    const [tooltipContent, setTooltipContent] = useState<React.ReactNode>("");
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [isLoading] = useState(false);
        
    // Pre-render mobile icons
    const [mobileIcons, setMobileIcons] = useState<{[key: string]: React.ReactNode}>({});
        
    // Add state to store the selected painting
    const [selectedPainting, setSelectedPainting] = useState('');
    
    // Add a loading state specifically for images
    const [imagesLoading, setImagesLoading] = useState(true);
    


    // Load Instagram embed script when modal opens
    useEffect(() => {
        // Get current section from state (moved this before using it)
        const currentSection = activeSection ? portfolioSections[activeSection as keyof typeof portfolioSections] : null;
        
        if (openModal && currentSection?.projects?.some((project: Project) => project.instagramEmbed)) {
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
        setSelectedPainting(paintingImages[randomIndex]);
    }, []);

    // Separate the painting update logic from the indicators setup
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        // Update wall pattern and paintings that need to change with time
        // Slow down LED screen animation with delay and reduced speed
        const ledDelay = 2.0; // 2 second delay
        const ledSpeed = 0.3; // 30% of original speed
        const ledTime = Math.max(0, (time - ledDelay) * ledSpeed);
        
        const wallPattern = generateCarpet(40, 30, ledTime, true);
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
        
        // Handle Title group visibility based on mobile state
        const titleGroup = svgNode.querySelector('#Title');
        if (titleGroup) {
            if (isMobile) {
                titleGroup.setAttribute('style', 'display: none;');
            } else {
                titleGroup.removeAttribute('style');
            }
        }
        
        // First, remove any existing indicators and strokes to prevent duplication
        const existingIndicators = svgNode.querySelectorAll('.interactive-indicator');
        existingIndicators.forEach(indicator => {
            indicator.remove();
        });
        
        const existingStrokes = svgNode.querySelectorAll('.interactive-stroke');
        existingStrokes.forEach(stroke => {
            stroke.remove();
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
                element.setAttribute("class", "cursor-pointer interactive-element");
                
                // Add outer stroke effect for interactive elements
                if (!isMobile) {
                    try {
                        // Create an outer stroke that follows the element's path
                        const strokeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        strokeGroup.setAttribute("class", "interactive-stroke");
                        strokeGroup.setAttribute("data-for", layerId);
                        
                        // Clone the element to create the stroke, but exclude image elements
                        const strokeElement = element.cloneNode(true) as SVGElement;
                        
                        // Remove image elements from the stroke clone
                        const imageElements = strokeElement.querySelectorAll('image');
                        imageElements.forEach(img => img.remove());
                        
                        // Remove any existing classes and styles from the stroke element
                        strokeElement.removeAttribute('class');
                        strokeElement.removeAttribute('style');
                        
                        // Apply stroke styling to the cloned element
                        strokeElement.setAttribute("fill", "none");
                        
                        // Get all section IDs and generate colors
                        const sectionIds = Object.keys(portfolioSections);
                        const hueStep = 360 / sectionIds.length;
                        
                        // Define which sections need dark colors for better contrast
                        const darkSections = ["TicketSlick", "Art", "MagicMirror", "Music", "Values", "Games"];
                        
                        // Generate stroke color based on section configuration
                        const colorIndex = sectionIds.indexOf(layerId);
                        const hue = (colorIndex * hueStep) % 360;
                        const saturation = 80;
                        
                        let strokeColor: string;
                        if (darkSections.includes(layerId)) {
                            // Use lower saturation and much lower lightness for dark but colorful colors
                            strokeColor = `hsl(${hue}, ${saturation * 0.75}%, 25%)`;
                        } else {
                            // Use standard vibrant colors
                            strokeColor = `hsl(${hue}, ${saturation}%, 60%)`;
                        }
                        
                        strokeElement.setAttribute("stroke", strokeColor);
                        strokeElement.setAttribute("stroke-width", "4");
                        strokeElement.setAttribute("stroke-opacity", "0"); // Start invisible
                        strokeElement.setAttribute("stroke-linejoin", "round");
                        strokeElement.setAttribute("stroke-linecap", "round");
                        
                        // Calculate a more varied staggered delay based on the index
                        // Use a non-linear pattern to create more interesting timing
                        const baseDelay = index * 0.3; // Reduced from 0.6 to 0.3 for faster appearance
                        const randomOffset = Math.sin(index * 0.7) * 0.4; // Reduced from 0.8 to 0.4
                        const staggerDelay = baseDelay + randomOffset;
                        strokeElement.style.setProperty('--animation-delay', `${staggerDelay}s`);
                        
                        strokeGroup.appendChild(strokeElement);
                        // Insert the stroke group before the original element to place it behind
                        svgNode.insertBefore(strokeGroup, element);
                        
                        // Start with pulse animation running
                        strokeElement.style.animationPlayState = "running";
                    } catch (err) {
                        console.error(`Error creating stroke for ${layerId}:`, err);
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
                        
                        // Store reference to the original element ID instead of cloning
                        setClickedElementId(layerId);
                        setOpenModal(true);
                    } catch (err) {
                        console.error(`Error processing click on ${layerId}:`, err);
                    }
                });
                
                // Add tooltip and stroke handlers
                element.addEventListener("mouseenter", function(e) {
                    const evt = e as MouseEvent;
                    const section = portfolioSections[layerId as keyof typeof portfolioSections];
                    
                    setTooltipContent(
                        <div className="flex items-center">
                            <span className="mr-2">{section.icon}</span>
                            <span>{formatTitleWithFont(section.title, layerId)}</span>
                        </div>
                    );
                    
                    setTooltipPosition({
                        x: evt.clientX,
                        y: evt.clientY - 40
                    });
                    
                    setShowTooltip(true);
                    
                    // Show stroke on hover (override pulse animation)
                    if (!isMobile) {
                        const strokeElement = svgNode.querySelector(`.interactive-stroke[data-for="${layerId}"]`);
                        if (strokeElement) {
                            const strokePath = strokeElement.querySelector('*') as SVGElement;
                            if (strokePath) {
                                strokePath.style.animationPlayState = "paused";
                                strokePath.style.animation = "none";
                                strokePath.style.transition = "stroke-opacity 0.3s ease-in-out";
                                strokePath.setAttribute("stroke-opacity", "1");
                                strokePath.style.strokeOpacity = "1";
                            }
                            strokeElement.classList.add('hovered');
                        }
                    }
                });
                
                element.addEventListener("mouseleave", function() {
                    setShowTooltip(false);
                    
                    // Hide stroke on mouse leave (resume pulse animation)
                    if (!isMobile) {
                        const strokeElement = svgNode.querySelector(`.interactive-stroke[data-for="${layerId}"]`);
                        if (strokeElement) {
                            const strokePath = strokeElement.querySelector('*') as SVGElement;
                            if (strokePath) {
                                strokePath.style.transition = "stroke-opacity 0.3s ease-in-out";
                                strokePath.setAttribute("stroke-opacity", "0");
                                strokePath.style.strokeOpacity = "0";
                                
                                // After transition completes, resume animation
                                setTimeout(() => {
                                    strokePath.style.animation = "";
                                    strokePath.style.animationPlayState = "running";
                                    strokePath.removeAttribute("stroke-opacity");
                                    strokePath.style.strokeOpacity = "0";
                                }, 1000);
                            }
                            strokeElement.classList.remove('hovered');
                        }
                    }
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

    // Add effect to hide/show strokes when mobile status changes
    useEffect(() => {
        const svgNode = roomRef.current;
        if (!svgNode) return;
        
        const strokes = svgNode.querySelectorAll('.interactive-stroke');
        
        if (isMobile) {
            // Hide strokes in mobile view
            strokes.forEach(stroke => {
                stroke.setAttribute('style', 'display: none;');
            });
        } else {
            // Show strokes in desktop view
            strokes.forEach(stroke => {
                stroke.removeAttribute('style');
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
                
                // Store reference to the original element ID instead of cloning
                setClickedElementId(sectionId);
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
                <div className={`flex items-center justify-center h-full relative ${isMobile ? 'px-4 pb-8' : 'p-4'}`}>
                    <RoomImage className={`max-w-full ${isMobile ? 'max-h-[85vh]' : 'h-[calc(100vh-50px)]'} w-auto object-contain ${imagesLoading ? 'images-loading' : ''}`} ref={roomRef} />
                </div>
                
                {/* Mobile navigation icons (visible on smaller screens) */}
                {isMobile && (
                    <div className="md:hidden px-2 pt-2 pb-4 overflow-y-auto flex-shrink-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.entries(portfolioSections).map(([sectionId, section]: [string, PortfolioSection]) => (
                                <div 
                                    key={sectionId}
                                    onClick={() => handleMobileIconClick(sectionId)}
                                    className="aspect-square bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200/50 dark:border-gray-600/50 text-center cursor-pointer transition-all duration-300 portfolio-section-icon hover:bg-white/90 dark:hover:bg-gray-800/90"
                                >
                                    <div className="h-full flex flex-col items-center justify-between py-2">
                                        <div className="flex-1 flex items-center justify-center min-h-0">
                                            {mobileIcons[sectionId] || (
                                                <div className="text-3xl">
                                                    {section.icon}
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white break-words leading-tight flex-shrink-0">{section.title}</h4>
                                    </div>
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
                                {formatTitleWithFont(currentSection.title, activeSection)}
                            </div>
                        )}
                    </Modal.Header>
                    <Modal.Body className="p-6">
                        <div className="flex flex-col items-center gap-8">
                            {/* Top section: SVG icon centered with accent lines */}
                            <div className="flex items-center w-full max-w-3xl">
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-grow"></div>
                                <div className="flex-shrink-0 mx-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800/30">
                                    <svg className="w-40 h-40" viewBox={elementViewBox} preserveAspectRatio="xMidYMid meet">
                                        {clickedElementId && roomRef.current && (() => {
                                            const allElements = roomRef.current.querySelectorAll(`#${clickedElementId}`);
                                            // Get the first element that's not inside a stroke group
                                            const originalElement = Array.from(allElements).find(el => 
                                                !el.closest('.interactive-stroke')
                                            );
                                            return (
                                                <g className="no-hover" dangerouslySetInnerHTML={{ 
                                                    __html: originalElement?.outerHTML || '' 
                                                }} />
                                            );
                                        })()}
                                    </svg>
                                </div>
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-grow"></div>
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
                                            <div key={projectIndex} className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300">
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
                                                <div className={`${project.iconSrc ? "md:col-span-3" : "md:col-span-4"} min-w-0`}>
                                                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                                                      {formatTitleWithFont(project.title, activeSection)}
                                                    </h5>
                                                    {project.yearRange && (
                                                      <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 flex-shrink-0">
                                                        {formatYearRange(project.yearRange)}
                                                      </span>
                                                    )}
                                                  </div>
                                                  <div className="text-base text-gray-700 dark:text-gray-300 break-words">
                                                    {project.description}
                                                  </div>
                                                  
                                                  {/* Display videos if available */}
                                                  {project.videos && project.videos.length > 0 && (
                                                    <div className="space-y-4 mt-3">
                                                      {project.videos.map((videoUrl: string, index: number) => (
                                                        <div key={index} className="relative pb-[56.25%] h-0 w-full">
                                                          {videoUrl.endsWith('.mp4') ? (
                                                            <video 
                                                              className="absolute top-0 left-0 w-full h-full rounded object-cover"
                                                              autoPlay={videoUrl.includes('Kassita')}
                                                              muted={videoUrl.includes('Kassita')}
                                                              loop={videoUrl.includes('Kassita')}
                                                              playsInline
                                                              controls={!videoUrl.includes('Kassita')}
                                                            >
                                                              <source src={videoUrl} type="video/mp4" />
                                                              Your browser does not support the video tag.
                                                            </video>
                                                          ) : (
                                                            <iframe 
                                                              className="absolute top-0 left-0 w-full h-full rounded"
                                                              src={videoUrl}
                                                              title={`${project.title} Video ${index + 1}`}
                                                              frameBorder="0"
                                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                              allowFullScreen
                                                            ></iframe>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                  
                                                  {/* Display YouTube video embed if available */}
                                                  {project.videoEmbed && (
                                                    <div className="mt-6">
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
                                                        {project.links.map((link: ProjectLink, index: number) => (
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
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Home;