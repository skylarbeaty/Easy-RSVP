"use client"

import LoginForm from "@components/LoginForm";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();

    const handleLogin = () => {
        router.push("/");
    }

    return (
        <section>
            <h2 className="text-center">Welcome Back</h2>
            <LoginForm onLogin={handleLogin}/>
        </section>
    )
}

export default Login