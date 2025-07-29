import React from 'react'
import { Button } from './ui/button'
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SidebarButtonProps {
    linkName: string;
    buttonName: string;
    icon: LucideIcon;
    className?: string;
}

export default function SidebarButton({ linkName, buttonName, icon: Icon, className }: SidebarButtonProps) {
    return (
        <div className="w-full rounded-[10px] overflow-hidden">
            <Button variant={"default"} className={`w-full text-md border-none rounded-none
                bg-foreground hover:bg-[#393b50]
                dark:bg-sidebar-accent dark:hover:bg-[#dfcdc8] ${className ? className : ''}`}>
                <Icon className='mr-4 w-4 h-4' />
                <Link href={linkName}>{buttonName}</Link>
            </Button>
        </div>
    )
}
