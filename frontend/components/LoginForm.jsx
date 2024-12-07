"use client"

import "@styles/forms.css";
import { useState } from "react";
import { api } from "@/utils/api";
import Link from 'next/link';
import { useUserUpdate } from "@components/AppWrapper";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const userUpdate = useUserUpdate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const res = await api.post("/auth/login", {email, password});
        userUpdate(res.user);
        onLogin();
    } catch(error){
        setError(error.toString());
    }
  }

  return (
    <form onSubmit={handleSubmit}>
        <p className="text-center">Please enter your details to login</p>
        <p className="text-center">If you don't have an accout: <Link href="/signup">Sign up</Link></p>
        <div className="form-group">
            <input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email:</label>
        </div>

        <div className="form-group">
            <input 
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
        </div>
        {error && <p className={"error-message text-center"}>{error}</p>}
        <div className="text-center">
            <button className="form-button" type="submit">Login</button>
        </div>
    </form>
  )
}

export default LoginForm