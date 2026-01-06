import GitHubIcon from './icons/GitHubIcon';

interface GitHubLinkProps {
  className?: string;
}

export default function GitHubLink({ className = '' }: GitHubLinkProps) {
  return (
    <a
      href="https://github.com/DragonnZhang/savings-simulator"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        flex items-center justify-center
        w-10 h-10 md:w-12 md:h-12
        rounded-full
        bg-white/5 backdrop-blur-md
        border border-white/10
        shadow-lg shadow-black/50
        text-[--nebula-text-muted]
        transition-all duration-300
        hover:scale-110 hover:bg-[#1A1A1D] hover:text-[--nebula-gold] hover:border-[--nebula-gold] hover:shadow-[--nebula-gold-dim]
        group
        ${className}
      `}
      aria-label="View Source on GitHub"
    >
      <GitHubIcon className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:rotate-12" />
    </a>
  );
}
