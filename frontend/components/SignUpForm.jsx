"use client"

import { useState } from "react";
import Link from 'next/link';

import "@styles/forms.css";
import { api } from "@/utils/api";
import { useUserUpdate } from "@components/AppWrapper";

const SignUpForm = ({ onSignUp = () => {} }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [error, setError] = useState("");
    const [errorPass, setErrorPass] = useState(false);

    const userUpdate = useUserUpdate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError){
            setErrorPass(true);
            setError(passwordValidationError);
            return;
        }

        if (password !== passwordCheck){
            setErrorPass(true);
            setError("Passwords do not match");
            return;
        }
            
        try{
            await api.post("/users",{name, email, password});
            const resLogin = await api.post("/auth/login",{email, password});
            userUpdate(resLogin.user);
            resetError();
            onSignUp();
        } catch(error){
            setError(error.toString());
        }
    }

    const resetError = () => {
        setError("");
        setErrorPass(false);
    }

    const updatePassword = (field, value) => {//side effects for setting either password field
        field(value);
        setErrorPass(false);
        setError("");
    }

    const validatePassword = (password) => {
        const minLength = 8;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (password.length < minLength){
            return `Password must be at least ${minLength} characters long`;
        }
        if (!regex.test(password)){
            return "Password must contain an uppercase letter, lowercase letter, number and special character"
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <p className="text-center">Please enter your details to sign up</p>
            <div className="form-group">
                <input
                    type="name"
                    autoComplete="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Name:</label>
            </div>
            <div className="form-group">
                <input
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email:</label>
            </div>
            <div className="form-group">
                <input 
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => updatePassword(setPassword, e.target.value)}
                    className={errorPass ? "error" : ""}
                />
                <label>Password:</label>
            </div>
            <div className="form-group">
                <input 
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={passwordCheck}
                    onChange={(e) => updatePassword(setPasswordCheck, e.target.value)}
                    className={errorPass ? "error" : ""}
                />
                <label>Confirm Password:</label>
            </div>
            {error && <p className="text-center error-message">{error}</p>}
            <div className="text-center">
                <button className="form-button" type="submit">Sign Up</button>
            </div>
            <p className="text-center">Already have an accout? <Link href="/login">Login</Link></p>
        </form>
      )
}

export default SignUpForm