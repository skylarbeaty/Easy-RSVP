"use client"

import Nav from "@components/Nav";
import SignUpForm from "@components/SignUpForm";
import { useRouter } from "next/navigation";

const SignUp = () => {
    const router = useRouter();

    const handleSignUp = () => {
        router.push("/");
    }
    
    return (
        <section>
            <Nav />
            <h2 className="text-center">Welcome to RSEZ</h2>
            <SignUpForm onSignUp={handleSignUp} />
        </section>
    )
}

export default SignUp