"use client"

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
    <form onSubmit={handleSubmit} className="login-form">
        <p className="text-center">Please enter your details to login</p>
        <p className="text-center">If you don't have an accout: <Link className="navbar-link" href="/signup">Sign up</Link></p>
        <div className="text-center login-field">
            <label>Email:</label>
            <input
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="text-center login-field">
            <label>Password:</label>
            <input 
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div className="text-center">
            <button className="form-button" type="submit">Login</button>
        </div>
        {error && <p className="text-center error-text">{error}</p>}
    </form>
  )
}

export default LoginForm