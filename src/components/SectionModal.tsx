import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { SectionStage } from './room/SectionStage';

interface SectionModalProps {
    open: boolean;
    sectionId: string;
    title: ReactNode;
    icon: ReactNode;
    accent: string;
    painting: string;
    meta?: ReactNode;
    onClose: () => void;
    children: ReactNode;
}

// Full-height panel: the section's 3D object on a turntable beside (or above, on phones) its content
function SectionModal({ open, sectionId, title, icon, accent, painting, meta, onClose, children }: SectionModalProps) {
    const closeButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const previous = document.activeElement as HTMLElement | null;
        closeButton.current?.focus();
        const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
            previous?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex animate-fade-in items-stretch justify-center bg-slate-900/30 backdrop-blur-[6px] md:items-center md:p-8" onMouseDown={event => event.target === event.currentTarget && onClose()}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="section-modal-title"
                className="relative flex w-full max-w-6xl animate-modal-in flex-col overflow-hidden bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)] md:h-[min(860px,92vh)] md:flex-row md:rounded-[28px]"
                style={{ ['--accent' as string]: accent }}
            >
                {/* Stage */}
                <div className="relative h-72 shrink-0 overflow-hidden md:h-auto md:w-[42%]"
                    style={{ background: `radial-gradient(120% 90% at 50% 35%, color-mix(in srgb, ${accent} 22%, white) 0%, color-mix(in srgb, ${accent} 8%, white) 55%, #F7F8F6 100%)` }}>
                    <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'url(/tile.svg)', backgroundSize: '75px 43.3px', maskImage: 'radial-gradient(circle at 50% 60%, black 20%, transparent 75%)' }} />
                    <SectionStage key={sectionId} id={sectionId} painting={painting} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
                    <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center font-display text-xs font-medium tracking-wide text-slate-500/80">
                        Drag to spin
                    </p>
                </div>

                {/* Content */}
                <div className="flex min-h-0 flex-1 flex-col">
                    <header className="flex items-center gap-4 border-b border-slate-100 px-6 pb-5 pt-6 md:px-10 md:pt-9">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-lg text-white shadow-sm" style={{ background: accent }}>
                            {icon}
                        </span>
                        <div className="min-w-0 flex-1">
                            <h2 id="section-modal-title" className="font-display text-2xl font-bold leading-tight text-slate-900 md:text-3xl">{title}</h2>
                            {meta && <div className="mt-1.5 text-sm text-slate-500">{meta}</div>}
                        </div>
                        <button
                            ref={closeButton}
                            onClick={onClose}
                            aria-label="Close"
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        >
                            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
                        </button>
                    </header>
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export default SectionModal;
