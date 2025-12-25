"use client"

import { Button } from "@/components/ui/button"
import usePremiumModal from "@/hooks/usePremiumModal"
import { PlusSquare } from "lucide-react"
import Link from "next/link"

interface CreateResumeButtonProps {
    canCreate: boolean
}

export default function CreateResumeButton({canCreate} : CreateResumeButtonProps) {
    const premiumModal = usePremiumModal()

    if(canCreate) {
        return(
            <Button asChild className="mx-auto flex gap-2 w-fit">
                <Link href="/editor">
                    <PlusSquare className="size-5"/>
                    New Resumes
                </Link>
            </Button>
        );
    }

    return (
        <Button className="mx-auto flex gap-2 w-fit"
            onClick={() => premiumModal.setOpen(true)}>
                    <PlusSquare className="size-5"/>
                    New Resumes
        </Button>
    );
    
}