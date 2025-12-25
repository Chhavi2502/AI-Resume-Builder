import {generalInfoSchema, GeneralInfoValues} from "@/lib/validation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EditorFormProps } from "@/lib/type"
import { useEffect } from "react"

export default function GeneralInfoForm({resumeData, setResumeData}: EditorFormProps) {
    const form = useForm<GeneralInfoValues>({
        resolver: zodResolver(generalInfoSchema),
        defaultValues: {
            title: resumeData.title || "",
            description: resumeData.description || ""
        }
    })

    useEffect(() => {
        const {unsubscribe}  = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
            // Update Resume Data
            setResumeData({...resumeData, ...values});
        })
        return unsubscribe
    }, [form, resumeData, setResumeData]);
    
    return <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold">General Info</h2>
            <p className="text-sm text-muted-foreground">
                This will not appear on your Resume
            </p>
            <Form {...form}>
                <form className="space-y-3">
                    <FormField 
                    control={form.control}
                    name="title"
                    render = {({field}) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input{...field} placeholder="My cool Resume" autoFocus></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}></FormField>
                    <FormField 
                    control={form.control}
                    name="description"
                    render = {({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input{...field} placeholder="A resume for my next job"></Input>
                            </FormControl>
                            <FormDescription>Describe what this resume is for</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}></FormField>
                </form>
            </Form>
        </div>
    </div>
}