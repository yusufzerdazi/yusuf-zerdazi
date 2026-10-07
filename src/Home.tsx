import { Spinner } from 'flowbite-react';
import { useEffect, useState, useCallback } from 'react';
import Room3D from './components/room/Room3D';
import SectionModal from './components/SectionModal';
import { ThumbnailStudio } from './components/room/SectionStage';
import { sectionAccent } from './components/room/sections';
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
        yearRange: { start: 2024, end: 2025 },
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
            description: "An AI powered light installation for a 'burning man' event in London called Decompression, which constructs uniquely generated visuals on an LED matrix in response both to the words spoken to it and music played nearby.\n\nFull build video coming soon!",
            yearRange: { start: 2023, end: 2025 },
            videos: ["./decom_3.mp4", "./decom_4.mp4", "./decom_1.mp4", "./decom_2.mp4"],
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
             description: "An interactive display created for Mischief (a music event series), featuring psychedelic visual effects and animations on a wall-mounted screen.",
             yearRange: { start: 2025, end: 2025 },
             videos: ["./mirror_1.mp4", "./mirror_2.mp4", "./mirror_3.mp4"],
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
        links: [
          { name: "TicketSlick", url: "https://www.ticketslick.com", icon: "fas fa-ticket", font: "Pacifico" },
          { name: "Instagram", url: "https://www.instagram.com/ticketslick/", icon: "fab fa-instagram" }
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
        yearRange: { start: 2025, end: 2025 },
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

// Canonical post URL with exactly one trailing slash, as Instagram's embed script expects
const instagramPermalink = (url: string) => url.replace(/\/+$/, '') + '/';

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

const sectionIds = Object.keys(portfolioSections);

// URL fragment for a section, e.g. "MagicMirror" -> "magicmirror"
const sectionSlug = (sectionId: string) => sectionId.toLowerCase();

function Home({ isMobile }: HomeProps) {
    const [openModal, setOpenModal] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
    const [isLoading] = useState(false);

    // Choose a random painting on first render
    const [selectedPainting] = useState(() => paintingImages[Math.floor(Math.random() * paintingImages.length)]);


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

    // Still renders of each section's 3D object for the mobile grid
    const [thumbnails, setThumbnails] = useState<{[key: string]: string}>({});
    const [roomReady, setRoomReady] = useState(false);
    const markRoomReady = useCallback(() => setRoomReady(true), []);
    const addThumbnail = useCallback((sectionId: string, url: string) => setThumbnails(current => ({ ...current, [sectionId]: url })), []);

    const handleHover = useCallback((sectionId: string | null, event?: PointerEvent) => {
        setHover(sectionId && event ? { id: sectionId, x: event.clientX, y: event.clientY - 40 } : null);
    }, []);

    // Each section has its own link (e.g. /#dj). Opening a section adds a history entry, so Back closes it.
    const openSection = useCallback((sectionId: string) => {
        setHover(null);
        setActiveSection(sectionId);
        setOpenModal(true);
        const hash = `#${sectionSlug(sectionId)}`;
        if (window.location.hash !== hash) window.history.pushState({ section: sectionId }, '', hash);
    }, []);

    const closeModal = useCallback(() => {
        setOpenModal(false);
        if (window.history.state?.section) window.history.back();
        else if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }, []);

    // Follow the address: on first load, and when Back/Forward or a pasted link changes it
    useEffect(() => {
        const sync = () => {
            const slug = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
            const sectionId = sectionIds.find(id => sectionSlug(id) === slug);
            if (sectionId) {
                setHover(null);
                setActiveSection(sectionId);
                setOpenModal(true);
            } else {
                setOpenModal(false);
            }
        };
        sync();
        window.addEventListener('popstate', sync);
        window.addEventListener('hashchange', sync);
        return () => {
            window.removeEventListener('popstate', sync);
            window.removeEventListener('hashchange', sync);
        };
    }, []);

    // Name the page after the open section, so shared links and tabs read well
    useEffect(() => {
        const section = openModal ? portfolioSections[activeSection] : null;
        document.title = section ? `${section.title.replace(/^Project: /, '')} · Yusuf Zerdazi` : 'Yusuf Zerdazi';
    }, [openModal, activeSection]);

    const hoveredSection = hover ? portfolioSections[hover.id] : null;

    const currentSection = activeSection ? portfolioSections[activeSection as keyof typeof portfolioSections] : null;

    return (
        <div className={`w-full ${isMobile ? 'pb-4' : 'h-full'}`}>
            <div className={`w-full h-full ${isMobile ? 'flex flex-col' : ''}`}>
                <div className={`flex items-center justify-center h-full relative ${isMobile ? 'px-4 pb-8' : 'p-4'}`}>
                    <Room3D
                        className={isMobile ? 'relative w-full' : 'fixed inset-0'}
                        sectionIds={sectionIds}
                        hoveredId={hover?.id ?? null}
                        painting={selectedPainting}
                        isMobile={isMobile}
                        onHover={handleHover}
                        onSelect={openSection}
                        paused={openModal}
                        onReady={markRoomReady}
                    />
                    {/* The room is a canvas, so keyboard and screen reader users get the sections as a list; it appears when focused */}
                    {!isMobile && (
                        <nav aria-label="Projects" className="sr-only fixed left-1/2 top-4 z-30 -translate-x-1/2 focus-within:not-sr-only">
                            <ul className="flex max-w-[90vw] flex-wrap justify-center gap-2 rounded-2xl border border-white/70 bg-white/85 p-2 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)] backdrop-blur-md">
                                {sectionIds.map(sectionId => (
                                    <li key={sectionId}>
                                        <button
                                            onClick={() => openSection(sectionId)}
                                            className="rounded-full px-3 py-1.5 font-display text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                                        >
                                            {formatTitleWithFont(portfolioSections[sectionId].title, sectionId)}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                    <a href="/models/CREDITS.txt" target="_blank" rel="noreferrer" className={`${isMobile ? "absolute" : "fixed z-10"} bottom-2 right-3 text-xs text-gray-400 hover:text-gray-600`}>
                        3D model credits
                    </a>
                    {/* Thumbnails render after the room, so the two don't compete for the phone's GPU while loading */}
                    {isMobile && roomReady && <ThumbnailStudio ids={sectionIds} painting={selectedPainting} onThumbnail={addThumbnail} />}
                </div>
                
                {/* Mobile navigation icons (visible on smaller screens) */}
                {isMobile && (
                    <div className="relative z-10 shrink-0 overflow-y-auto px-2 pb-4 pt-2 md:hidden">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.entries(portfolioSections).map(([sectionId, section]: [string, PortfolioSection]) => (
                                <div 
                                    key={sectionId}
                                    onClick={() => openSection(sectionId)}
                                    className="portfolio-section-icon aspect-square cursor-pointer rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm transition active:scale-[0.98]"
                                >
                                    <div className="h-full flex flex-col items-center justify-between py-2">
                                        <div className="flex-1 flex items-center justify-center min-h-0">
                                            {thumbnails[sectionId] ? (
                                                <img src={thumbnails[sectionId]} alt="" className="size-full object-contain" />
                                            ) : (
                                                <div className="text-3xl">
                                                    {section.icon}
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="shrink-0 break-words font-display text-sm font-semibold leading-tight text-slate-800">{formatTitleWithFont(section.title, sectionId)}</h4>
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
                {!isMobile && hover && hoveredSection && (
                    <div 
                        className="pointer-events-none fixed z-40 -translate-x-1/2 rounded-full border border-white/60 bg-white/80 px-4 py-2 font-display text-sm font-semibold text-slate-800 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.35)] backdrop-blur-md"
                        style={{ 
                            left: hover.x,
                            top: hover.y
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="flex size-6 items-center justify-center rounded-full text-xs text-white" style={{ background: sectionAccent(sectionIds, hover.id, 55) }}>{hoveredSection.icon}</span>
                            <span>{formatTitleWithFont(hoveredSection.title, hover.id)}</span>
                        </div>
                    </div>
                )}
                
                {/* Section modal: the object in 3D beside its projects */}
                {currentSection && (
                    <SectionModal
                        open={openModal}
                        sectionId={activeSection}
                        title={formatTitleWithFont(currentSection.title, activeSection)}
                        icon={currentSection.icon}
                        accent={sectionAccent(sectionIds, activeSection, 55)}
                        painting={selectedPainting}
                        meta={currentSection.yearRange && formatYearRange(currentSection.yearRange)}
                        onClose={closeModal}
                    >
                        {currentSection.description && (
                            <p className="mb-8 text-base leading-relaxed text-slate-600">{currentSection.description}</p>
                        )}
                        {/* Bottom section: Projects content spanning full width */}
                        {currentSection && (
                            <div className="w-full">
                                {/* Projects for sections with project arrays */}
                                {currentSection.projects && (
                                    <div className="space-y-5">
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
                                          .map((project, projectIndex) => {
                                            const isTwoVideos = (project.videos?.length === 2);
                                            return (
                                            <div key={projectIndex} className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] md:p-6">
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
                                                    <h5 className="break-words font-display text-xl font-bold text-slate-900">
                                                      {formatTitleWithFont(project.title, activeSection)}
                                                    </h5>
                                                    {project.yearRange && (
                                                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 font-display text-xs font-semibold tracking-wide text-slate-500">
                                                        {formatYearRange(project.yearRange)}
                                                      </span>
                                                    )}
                                                  </div>
                                                  <div className="break-words text-[15px] leading-relaxed text-slate-600">
                                                    {project.description}
                                                  </div>
                                                  
                                                  {/* Display videos if available */}
                                                  {project.videos && project.videos.length > 0 && (
                                                    <div className={`mt-3 ${isTwoVideos ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
                                                      {project.videos.map((videoUrl: string, index: number) => (
                                                        <div key={index} className={`relative ${isTwoVideos ? 'pb-[177.78%]' : 'pb-[56.25%]'} h-0 w-full`}>
                                                          {videoUrl.endsWith('.mp4') ? (
                                                            <video 
                                                              className="absolute left-0 top-0 size-full rounded-xl object-cover"
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
                                                              className="absolute left-0 top-0 size-full rounded-xl"
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
                                                          className="absolute left-0 top-0 size-full rounded-xl"
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
                                                      <h4 className="mb-2 font-display text-base font-semibold text-slate-900">
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
                                                              data-instgrm-permalink="${instagramPermalink(project.instagramEmbed)}?utm_source=ig_embed&amp;utm_campaign=loading" 
                                                              data-instgrm-version="14"
                                                              style="background:#FFF; border:0; border-radius:16px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"
                                                            ><a href="${instagramPermalink(project.instagramEmbed)}" target="_blank" rel="noreferrer" style="display:block; padding:16px; font:600 14px system-ui, sans-serif; color:#0f172a; text-decoration:none;">View this post on Instagram</a></blockquote>
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
                                                            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 font-display text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent)]"
                                                          >
                                                            <i className={`${link.icon} mr-2`}></i>
                                                            <span style={link.font ? { fontFamily: `${link.font}, cursive`, fontWeight: 400 } : undefined}>{link.name}</span>
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
                                            );
                                          })}
                                    </div>
                                )}
                            </div>
                        )}
                    </SectionModal>
                )}
            </div>
        </div>
    );
}

export default Home;