// components/navigation/DynamicNavigationMenu.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { navConfig } from "./navConfig";
import { ListItem } from "./ListItem";
import { ClockWeather } from "./ClockWeather";

export default function DynamicNavigationMenu() {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/MindVaultLogo.png"
          alt="Logo"
          width={36}
          height={36}
          className="rounded-md"
        />
        <span className="font-semibold text-lg">MindVault</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6 ml-10">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            {navConfig.map((item) =>
              item.subItems ? (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[800px]">
                      {item.subItems.map((sub) => (
                        <ListItem
                          key={sub.title}
                          title={sub.title}
                          href={sub.href!}
                          description={sub.description}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.href!}>{item.title}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Desktop Clock + Weather */}
      <ClockWeather />

      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden ml-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] flex flex-col pt-12">
            {/* Clock + Weather at top */}
            <ClockWeather compact />

            <SheetHeader className="mt-2 mb-3 border-b pb-2">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <ul className="mt-2 space-y-3 overflow-y-auto">
              {navConfig.map((item) => (
                <li key={item.title}>
                  {item.subItems ? (
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <ul className="ml-4 mt-2 space-y-2">
                        {item.subItems.map((sub) => (
                          <li key={sub.title}>
                            <Link
                              href={sub.href!}
                              className="block text-sm text-muted-foreground hover:text-foreground transition"
                            >
                              <div className="font-medium">{sub.title}</div>
                              {sub.description && (
                                <p className="text-xs text-muted-foreground leading-snug">
                                  {sub.description}
                                </p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className="block text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground leading-snug">
                          {item.description}
                        </p>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
