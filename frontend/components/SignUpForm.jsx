"use client"

import "@styles/forms.css";
import { useState } from "react";
import { api } from "@/utils/api";
import { useUserUpdate } from "@components/AppWrapper";

const SignUpForm = ({ onSignUp = () => {} }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [error, setError] = useState("");

    const userUpdate = useUserUpdate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordCheck){
            setError("Passwords do not match");
            return;
        }
            
        try{
            await api.post("/users",{name, email, password});
            const resLogin = await api.post("/auth/login",{email, password});
            userUpdate(resLogin.user);
            onSignUp();
        } catch(error){
            setError(error.toString());
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
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password:</label>
            </div>
            <div className="form-group">
                <input 
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                />
                <label>Confirm Password:</label>
            </div>
            {error && <p className="text-center error-message">{error}</p>}
            <div className="text-center">
                <button className="form-button" type="submit">Sign Up</button>
            </div>
        </form>
      )
}

export default SignUpForm