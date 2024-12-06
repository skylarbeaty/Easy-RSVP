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
        <form onSubmit={handleSubmit} className="login-form">
            <p className="text-center">Please enter your details to sign up</p>
            <div className="text-center login-field">
                <label>Name:</label>
                <input
                    type="name"
                    autoComplete="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <><br /></>
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
            <><br /></>
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
            <div className="text-center login-field">
                <label>Confirm Password:</label>
                <input 
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                />
            </div>
            <div className="text-center">
                <button className="form-button" type="submit">Sign Up</button>
            </div>
            {error && <p className="text-center error-text">{error}</p>}
        </form>
      )
}

export default SignUpForm