// components/navigation/ListItem.tsx

"use client";

import Link from "next/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

interface ListItemProps {
  title: string;
  href: string;
  description?: string;
}

export function ListItem({ title, href, description }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block p-2 rounded-md hover:bg-muted/10 transition-colors"
        >
          <div className="font-medium">{title}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
