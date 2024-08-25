'use client'

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, Users, Folder, Calendar, FileText, PieChart } from 'lucide-react';

const navItems = [
    { href: '/streams', label: 'Streams', icon: Home },
    { href: '/providers', label: 'Providers', icon: Users },
    { href: '/timelines', label: 'Timelines', icon: Calendar },
    { href: '/playlists', label: 'Playlists', icon: Folder },
    { href: '/videos', label: 'Videos', icon: FileText },
];

const SideNavigation = () => {
    const pathname = usePathname();

    return (
        <aside className="w-44 bg-gray-900 py-44 flex flex-col items-start rounded-lg h-full">
            <nav className="flex flex-col space-y-8 w-full">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center w-full px-4 py-2 text-gray-400 hover:text-white ${isActive ? 'bg-gray-800 text-white rounded-md' : ''}`}
                        >
                            <Icon className="mr-3" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export default SideNavigation;