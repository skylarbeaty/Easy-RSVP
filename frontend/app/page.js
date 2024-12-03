"use client"

import { useState, useEffect } from "react";
import { api } from "@utils/api";
import Nav from "@components/Nav";
import LoginForm from "@components/LoginForm";
import CreateEventForm from "@components/CreateEventForm";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() =>{
    async function fetchUser() {
      try{
        const res = await api.get("/auth/me");
        setUser(res.user);
      } catch (error){
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = (userDate) => {
    setUser(null);
  }

  return (
    <section>
      <Nav user = {user} onLogout={handleLogout} />
      <><br /></>
      <h1 className="header text-center">RS<span className="gradient">EZ</span></h1>
      <p className="text-center">The easy way to share RSVPs</p>
      <><br /></>
      {user ? (
        <>
          <p className="text-center">Logged in as: {user.name}</p>
          <CreateEventForm />
        </>
      ) : (
        <>
          <p className="text-center">Login to create an event</p>
          <LoginForm onLogin={handleLogin} />
        </>
      )}
    </section>
  )
}

export default Home