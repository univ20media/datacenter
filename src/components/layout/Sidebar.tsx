'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, CalendarPlus, Archive as ArchiveIcon } from 'lucide-react';

const navItems = [
  { name: '대시보드', href: '/', icon: LayoutDashboard },
  { name: '시즌 맵', href: '/season-map', icon: Calendar },
  { name: '플래너', href: '/planner', icon: CalendarPlus },
  { name: '아카이브', href: '/archive', icon: ArchiveIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          YouthMedia<span className="text-blue-600">.Ed</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
        Internal Editorial Tool v1.0
      </div>
    </aside>
  );
}
