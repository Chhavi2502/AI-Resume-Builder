"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar(){
    return <header className="shadow-sm">
        <div className=" mx-auto max-w-7xl p-3 flex items-center justify-between gap-3">
            <Link href="/resumes" className="flex items-center gap-2">
                <Image
                src={logo} 
                alt="Logo"
                width={35}
                height={35}
                />
                <span className="text-lg font-bold tracking-tight">
                    AI Resume Builder
                </span>
            </Link>
            <div className="flex items-center gap-3">
            <ThemeToggle/>
            <UserButton appearance={{
                elements: {
                    avatarBox: {
                        width: 35,
                        height: 35
                    }
                }
            }}
            >
                <UserButton.MenuItems>
                    <UserButton.Link
                    label="Billing"
                    labelIcon={<CreditCard className="size-4"/>}
                    href="/billing"/>
                </UserButton.MenuItems>
            </UserButton>
            </div>
        </div>
    </header>
}