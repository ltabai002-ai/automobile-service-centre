interface LogoProps {
  light?: boolean;
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ light = false, className = "", showTagline = false }: LogoProps) {
  return (
    <a href="#top" className={`inline-flex items-center gap-2.5 group ${className}`} aria-label="InField Home">
      <img 
        src="/autosales.webp" 
        alt="Autosales Logo" 
        className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
      />

      {showTagline && (
        <div className="flex flex-col justify-center">
          <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase mt-0.5">
            Showroom Management
          </span>
        </div>
      )}
    </a>
  );
}
