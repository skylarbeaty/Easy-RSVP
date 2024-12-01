import { useState } from "react";
import { apiFetch as api } from "@/utils/api";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const res = await api("/auth/login",{ 
            method: "POST", 
            body: JSON.stringify({email, password})});
        onLogin(res.user);
    } catch(error){
        setError(error.toString());
    }
  }

  return (
    <form onSubmit={handleSubmit}>
        <h2 className="text-center">Login</h2>
        <div className="text-center">
            <label>Email:</label>
            <input
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="text-center">
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
            <button type="submit">Login</button>
        </div>
        {error && <p style={{color: "red"}} className="text-center">{error}</p>}
    </form>
  )
}

export default LoginForm