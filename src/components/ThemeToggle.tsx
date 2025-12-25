"use client"

import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export default function ThemeToggle(){
    const {setTheme} = useTheme();

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"></Sun>
                <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100"></Moon>
                <span className="sr-only">Toggle Theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {setTheme("light")}}>
                Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {setTheme("dark")}}>
                Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {setTheme("system")}}>
                System
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}