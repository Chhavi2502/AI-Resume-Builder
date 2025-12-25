import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/type";
import { summarySchema, summaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSummaryButton from "./GenerateSummaryButton";

export default function SummaryForm({resumeData, setResumeData} : EditorFormProps){

    const form = useForm<summaryValues>({
        resolver: zodResolver(summarySchema),
        defaultValues: {
            summary: resumeData.summary || ""
        }
    })

    useEffect(() => {
        const {unsubscribe} = form.watch((async (values) => {
            const isValid = form.trigger();
            if(!isValid) return;

            setResumeData({...resumeData, ...values })
        }))
        return unsubscribe
    }, [form, resumeData, setResumeData])

    return <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-1.5 text-center">
            <h2 className="font-semibold text-2xl">Professional Summary</h2>
            <p className="text-sm text-muted-foreground">
                Write a short introduction for your Resume or let the AI generate for you from the Enterd Data.
            </p>
        </div>
        <Form {...form}>
            <form className="space-y-3">
                <FormField
                control={form.control}
                name="summary"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className="sr-only">Professional Summary</FormLabel>
                        <FormControl>
                            <Textarea {...field}
                            placeholder="A brief, enaging text about yourself."/>
                        </FormControl>
                        <FormMessage/>
                        <GenerateSummaryButton
                            resumeData={resumeData}
                            onSummaryGenerated={(summary) => form.setValue("summary", summary)}>
                        </GenerateSummaryButton>
                    </FormItem>
                )}
                />
            </form>
        </Form>
    </div>
}