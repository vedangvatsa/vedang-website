"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CourseLink {
    href: string;
    label: string;
    disabled?: boolean;
}

interface CourseSection {
    title: string;
    links: CourseLink[];
}

interface CourseSidebarProps {
    courseName: string;
    sections: CourseSection[];
}

export function CourseSidebar({ courseName, sections }: CourseSidebarProps) {
    const pathname = usePathname();

    return (
        <Card className="shadow-sm bg-muted/30 border-muted">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                    <BookOpen className="h-5 w-5" />
                    <h4 className="font-semibold text-sm uppercase tracking-wider">{courseName}</h4>
                </div>
                <nav className="space-y-4">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                                {section.title}
                            </p>
                            <div className="space-y-2">
                                {section.links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.disabled ? "#" : link.href}
                                        className={cn(
                                            "block text-sm transition-colors rounded-md px-2 py-1.5 -mx-2",
                                            pathname === link.href
                                                ? "text-primary font-medium bg-primary/10"
                                                : "text-muted-foreground hover:text-primary hover:bg-muted/50",
                                            link.disabled && "opacity-50 pointer-events-none"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </CardContent>
        </Card>
    );
}
