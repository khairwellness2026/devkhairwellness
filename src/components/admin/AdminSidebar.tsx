'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  FileText,
  Building2,
  Users,
  Image as ImageIcon,
  CalendarCheck,
  Mail,
  FolderOpen,
  Settings,
  Search,
  ShieldCheck,
  History,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  userEmail?: string;
}

export default function AdminSidebar({ userRole = 'SUPER_ADMIN', userEmail = 'admin@khair.in' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Homepage CMS', href: '/admin/homepage', icon: Home },
    { label: 'Page CMS', href: '/admin/pages', icon: FileText },
    { label: 'Departments', href: '/admin/departments', icon: Building2 },
    { label: 'Doctors', href: '/admin/doctors', icon: Users },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Appointments', href: '/admin/appointments', icon: CalendarCheck, badge: 'Live' },
    { label: 'Contact Enquiries', href: '/admin/enquiries', icon: Mail },
    { label: 'Media Library', href: '/admin/media', icon: FolderOpen },
    { label: 'Website Settings', href: '/admin/settings', icon: Settings },
    { label: 'SEO Management', href: '/admin/seo', icon: Search },
    { label: 'Users & Roles', href: '/admin/users', icon: ShieldCheck, superOnly: true },
    { label: 'Activity Logs', href: '/admin/logs', icon: History },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {}
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-khair-deepForest text-white flex flex-col justify-between flex-shrink-0 min-h-screen border-r border-khair-gold/20 shadow-xl">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-khair-gold/20 border border-khair-gold/40 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-khair-goldLight" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold tracking-tight text-white leading-none">
              KHAIR Admin
            </h2>
            <span className="text-[10px] font-semibold tracking-widest text-khair-goldLight uppercase">
              Healthcare CMS
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{userEmail}</p>
            <span className="inline-block px-2 py-0.5 mt-0.5 text-[9px] font-bold rounded-full bg-khair-gold text-khair-deepForest">
              {userRole}
            </span>
          </div>
          <a
            href="/en"
            target="_blank"
            title="View Live Website"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-khair-goldLight transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navItems.map((item) => {
            if (item.superOnly && userRole !== 'SUPER_ADMIN') return null;

            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-khair-gold text-khair-deepForest font-bold shadow-sm'
                    : 'text-khair-warmIvory/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

