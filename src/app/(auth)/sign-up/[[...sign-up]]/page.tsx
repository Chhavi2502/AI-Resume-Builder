import { SignUp } from "@clerk/nextjs";

export default function Page(){
    return <main className = "flex h-screen align-center justif-center p-3">
        <SignUp/>
    </main>
}