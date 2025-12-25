"use client"

import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { ResumeValues } from "@/lib/validation";
import { useState } from "react";
import ResumePreviewSection from "./ResumePreviewSection";
import { cn, mapToResumeValues } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import useAutoSaveResume from "./useAutoSaveResume";
import { ResumeServerData } from "@/lib/type";

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null
}

export default function ResumeEditor({resumeToEdit} : ResumeEditorProps){
    const searchParams = useSearchParams();

    const [resumeData, setResumeData] = useState<ResumeValues>(
        resumeToEdit ? mapToResumeValues(resumeToEdit) : {}
    )

    const [ showSmResumePreview, setShowSmResumePreview ] = useState(false)

    const currentStep = searchParams.get("step") || steps[0].key;

    const {isSaving, hasUnsavedChanges} = useAutoSaveResume(resumeData)

    useUnloadWarning(hasUnsavedChanges)

    function setStep(key: string) {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set("step", key)
        window.history.pushState(null, "", `?${newSearchParams.toString()}`)
    }

    const FormComponent = steps.find(
        step => step.key === currentStep
    )?.component;

    useUnloadWarning()

    return <div className="flex grow flex-col">
        <header className="space-y-1.5 border-b px-3 py-5 text-center">
            <h1 className="text-2xl font-bold">Design your resume</h1>
            <p className="text-sm text-muted-foreground">
                Follow the steps below to create your resume. Your progress will be saved automatically.
            </p>
        </header>
        <main className="relative grow">
            <div className="absolute flex bottom-0 top-0 w-full">
                <div className={cn("w-full md:w-1/2 p-3 overflow-y-auto space-y-6",
                    showSmResumePreview && "hidden"
                )}>
                    <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep}/>
                    {FormComponent && <FormComponent
                    resumeData={resumeData}
                    setResumeData={setResumeData}/>}
                </div>
                <div className="grow md:border-r"></div>
                <ResumePreviewSection 
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                    className={cn(showSmResumePreview && "flex")}>
                </ResumePreviewSection>
            </div>
        </main>
        <Footer 
            currentStep={currentStep} 
            setCurrentStep={setStep}
            showSmResumePreview={showSmResumePreview}
            setShowSmResumePreview={setShowSmResumePreview}
            isSaving={isSaving}>
        </Footer>
    </div>
}