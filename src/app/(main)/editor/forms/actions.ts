"use server"

import { GenerateSummaryInput, generateSummarySchema, GenerateWorkExperienceInput, generateWorkExperienceSchema, WorkExperience } from "@/lib/validation";
import openai from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { canUseAITools } from "@/lib/permission";
import gemini from "@/lib/gemini";
import huggingface from "@/lib/huggingface";
import openrouter from "@/lib/openrouter";

export async function generateSummaryUsingOpenAI(input:  GenerateSummaryInput) {

    const {userId} = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId)

    if( !canUseAITools(subscriptionLevel) ) {
        throw new Error("Upgrade your subscription to use this feature")
    }

    const { jobTitle, workExperiences, educations, skills } = generateSummarySchema.parse(input)

    const systemMessage = `
    Ypu are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional
    `

    const userMessage = `
    Please generate a professional resume summary from this data:

    Job Title: ${jobTitle || "N/A"}

    Work experience: 
    ${workExperiences?.map(exp => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description: ${exp.description || "N/A"}
    `).join("\n\n")}
    

    Educations: 
    ${educations?.map(edu => `
        Position: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}

    `).join("\n\n")}

    Skills:
    ${skills}
    `
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ],
    });
    const aiResponse = completion.choices[0].message.content;

    if(!aiResponse) {
        throw new Error("Failed to generate AI response")
    }

    return aiResponse
  
}

export async function generateWorkExperienceUsingOpenAI(
    input: GenerateWorkExperienceInput
){

    const {userId} = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId)

    if(!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature")
    }
    
    const {description} = generateWorkExperienceSchema.parse(input)

    const systemMessage = `
    You are a job resume generator UI. Your task is to generate a single work experience based on the user input.
    Your response must adhere to the following structure.
    You can omit fields if they can't be infered from the provided data, but don't add new ones.

    Job title: <job title>
    Company: <company>
    StartDate: <format: YYYY-MM-DD> (only if provided)
    EndDate: <format: YYYY-MM-DD> (only if provided)
    Description: <an optimized description in bullet format, might be inferred from the job title>
    `

    const userMessage = `
    Please provide a work experience entry from this description:
    ${description}
    `

     const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ],
    });
    const aiResponse = completion.choices[0].message.content;

    if(!aiResponse) {
        throw new Error("Failed to generate AI response")
    }

    return {
        position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
        company: aiResponse.match(/Company: (.*)/)?.[1] || "",
        description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
        startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
        endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    } satisfies WorkExperience;

}


export async function generateSummary(input:  GenerateSummaryInput) {

    const {userId} = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId)

    if( !canUseAITools(subscriptionLevel) ) {
        throw new Error("Upgrade your subscription to use this feature")
    }

    const { jobTitle, workExperiences, educations, skills } = generateSummarySchema.parse(input)

    const systemMessage = `
    Ypu are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional
    `

    const userMessage = `
    Please generate a professional resume summary from this data:

    Job Title: ${jobTitle || "N/A"}

    Work experience: 
    ${workExperiences?.map(exp => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description: ${exp.description || "N/A"}
    `).join("\n\n")}
    

    Educations: 
    ${educations?.map(edu => `
        Position: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}

    `).join("\n\n")}

    Skills:
    ${skills}
    `
    const completion = await openrouter.chat.completions.create({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
            {
            role: "system",
            content: systemMessage,
            },
            {
            role: "user",
            content: userMessage,
            },
        ],
        temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
    throw new Error("Failed to generate AI response");
    }

    return aiResponse;
}

export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    if (!canUseAITools(subscriptionLevel)) throw new Error("Upgrade your subscription to use this feature");

    const { description } = generateWorkExperienceSchema.parse(input);

    const systemMessage = `
    You are a job resume generator UI. Your task is to generate a single work experience based on the user input.
    Your response must adhere to the following structure.
    You can omit fields if they can't be infered from the provided data, but don't add new ones.

    Job title: <job title>
    Company: <company>
    StartDate: <format: YYYY-MM-DD> (only if provided)
    EndDate: <format: YYYY-MM-DD> (only if provided)
    Description: <an optimized description in bullet format, might be inferred from the job title>
    `

    const userMessage = `
    Please provide a work experience entry from this description:
    ${description}
    `

    const completion = await openrouter.chat.completions.create({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
        ],
        temperature: 0.4,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) throw new Error("Failed to generate AI response");

    return {
        position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
        company: aiResponse.match(/Company: (.*)/)?.[1] || "",
        description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
        startDate: aiResponse.match(/StartDate: (\d{4}-\d{2}-\d{2})/)?.[1],
        endDate: aiResponse.match(/EndDate: (\d{4}-\d{2}-\d{2})/)?.[1],
    } satisfies WorkExperience;
}

