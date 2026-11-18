import { Bell, Search, ExternalLink } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-khair-softBeige px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div>
        <h1 className="font-serif text-lg sm:text-xl font-bold text-khair-deepForest leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-[11px] text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/en"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-khair-warmIvory text-khair-deepForest border border-khair-gold/40 hover:bg-khair-softBeige transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </header>
  );
}

