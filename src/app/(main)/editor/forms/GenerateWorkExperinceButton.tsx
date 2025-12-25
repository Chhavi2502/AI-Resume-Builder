import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GenerateWorkExperienceInput, generateWorkExperienceSchema, WorkExperience } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateWorkExperience } from "./actions";
import { DialogDescription, DialogHeader, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/ui/LoadingButton";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permission";


interface GenerateWorkExperinceButtonProps {
    onWorkExperienceGenerated: (workExperince: WorkExperience) => void;
}

export default function GenerateWorkExperinceButton({onWorkExperienceGenerated} : GenerateWorkExperinceButtonProps) {
    const subscriptionLevel = useSubscriptionLevel();

    const premiumModal = usePremiumModal();

    const [showInputDailog, setShowInputDailog] = useState(false)

    return <>
    <Button
        variant="outline"
        type="button"
        onClick={() => {
            if( !canUseAITools(subscriptionLevel) ){
                premiumModal.setOpen(true);
                return;
            }
            setShowInputDailog(true)
        }}>
            <WandSparklesIcon className="size-4">
            </WandSparklesIcon>
            Smart Fill (AI)
    </Button>
    <InputDailog
    open={showInputDailog}
    onOpenChange={setShowInputDailog}
    onWorkExperienceGenerated={(workExperince) => {
        onWorkExperienceGenerated(workExperince);
        setShowInputDailog(false)
    }}/>
    </>
}

interface InputDialogProps{
    open: boolean
    onOpenChange: (open: boolean) => void;
    onWorkExperienceGenerated: (workExperince: WorkExperience) => void;
}

function InputDailog({open, onOpenChange, onWorkExperienceGenerated} : InputDialogProps) {
    const {toast} = useToast()

    const form = useForm<GenerateWorkExperienceInput>({
        resolver: zodResolver(generateWorkExperienceSchema),
        defaultValues: {
            description: ""
        }
    })

    async function onSubmit(input: GenerateWorkExperienceInput) {
        try{
            const response = await generateWorkExperience(input)
            onWorkExperienceGenerated(response)
        }catch(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again"
            })
        }
    }
    return (
    <Dialog
    open={open}
    onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Generate Work Experience
                </DialogTitle>
                <DialogDescription>
                    Describe the work experience and the AI will generate an optimized entry for you.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                    {...field}
                                    placeholder={`E.g. "from nov 2019 to dec 2020 I worked at google as a software engineer, tasks were ...`}
                                    autoFocus>
                                    </Textarea>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}>
                    </FormField>
                    <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                        Generate
                    </LoadingButton>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    );
}