"use client"

import SignUpForm from "@components/SignUpForm";
import { useRouter } from "next/navigation";

const SignUp = () => {
    const router = useRouter();

    const handleSignUp = () => {
        router.push("/");
    }
    
    return (
        <section className="justify-center">
            <h2 className="text-center">Welcome to RSEZ</h2>
            <SignUpForm onSignUp={handleSignUp} />
        </section>
    )
}

export default SignUp