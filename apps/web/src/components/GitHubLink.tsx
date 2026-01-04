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
        fixed top-4 right-4 z-50
        flex items-center justify-center
        w-10 h-10 md:w-12 md:h-12
        rounded-full
        bg-white/10 backdrop-blur-md
        border border-white/20
        shadow-lg
        text-white/80 hover:text-white
        transition-all duration-300
        hover:scale-110 hover:bg-white/20 hover:shadow-emerald-500/20
        group
        ${className}
      `}
      aria-label="View Source on GitHub"
    >
      <GitHubIcon className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:rotate-12" />
    </a>
  );
}
