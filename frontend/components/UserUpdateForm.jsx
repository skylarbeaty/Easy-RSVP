"use client"

import "@styles/forms.css";
import { useState } from "react";
import { useUser } from "@components/AppWrapper";
import { api } from "@utils/api";

const UserUpdateForm = () => {  
  const user = useUser();
  
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [error, setError] = useState("");
  const [errorMatch, setErrorMatch] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name,
      email,
      passwordCurrent
    }

    if (password != "") {//only add the password if given
      e.preventDefault();
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
          setErrorMatch(true);
          setError(passwordValidationError);
          return;
      }
      else if (password !== passwordCheck){
        setErrorMatch(true);
        setError("Passwords do not match");
        return;
      }
      else {
        body.passwordNew = password;
      }
    }

    try {
      const res = await api.patch(`/users/${user.id}`, body);
      setSuccess(true);
      resetError();
      setPasswordCurrent("");
    } 
    catch(error) {
      setSuccess(false);
      setError(error.message || "Failed to update user")
      if (error.status = 401)
        setErrorPass(true);
    }
  }

  const resetError = () => {
    setError("");
    setErrorMatch(false);
    setErrorPass(false);
  }

  const changedPassword = (value) => {
      setPasswordCurrent(value);
      setErrorPass(false);
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
          <div className="form-group">
          <input 
              type="text"
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
          />
          <label htmlFor="name">Name</label>
          </div>

          <div className="form-group">
          <input 
              type="email"
              id="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
          />
          <label htmlFor="email">Email</label>
          </div>

          <div className="form-group">
          <input 
              type="password"
              id="new-password"
              value={password} 
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className={errorMatch ? "error" : ""}
          />
          <label htmlFor="new-password">New Password</label>
          </div>

          <div className="form-group">
          <input 
              type="password"
              id="verify-password"
              value={passwordCheck}
              autoComplete="new-password"
              onChange={(e) => setPasswordCheck(e.target.value)}
              className={errorMatch ? "error" : ""}
          />
          <label htmlFor="verify-password">Verify Password</label>
          </div>

          <div className="form-group">
          <input 
              type="password" 
              id="current-password"
              value={passwordCurrent}
              autoComplete="current-password"
              onChange={(e) => changedPassword(e.target.value)}
              className={errorPass ? "error" : ""}
          />
          <label htmlFor="current-password"> Current Password</label>
          </div>
          {success && <p>Profile updated successfully</p>}
          {error && <p className={"error-message"}>{error}</p>}
          <div>
              <button type="submit" disabled={errorPass}>Save</button>
          </div>
      </form>
  )
}

export default UserUpdateForm