"use client"

import "@styles/forms.css";
import { useState } from "react";
import Link from 'next/link';
import { api } from "@/utils/api";
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

  const updateField = (state, value) => {
    state(value);
    setError("");
  }

  return (
    <form onSubmit={handleSubmit}>
        <p className="text-center">Please enter your details to login</p>
        <div className="form-group">
            <input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => updateField(setEmail, e.target.value)}
                className={error ? "error" : ""}
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
                onChange={(e) => updateField(setPassword, e.target.value)}
                className={error ? "error" : ""}
            />
            <label htmlFor="password">Password:</label>
        </div>
        {error && <p className={"error-message text-center"}>{error}</p>}
        <div className="text-center">
            <button className="form-button" type="submit" disabled={error}>Login</button>
        </div>
        <p className="text-center">If you don't have an accout: <Link href="/signup">Sign up</Link></p>
    </form>
  )
}

export default LoginForm