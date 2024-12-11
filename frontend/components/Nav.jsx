"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

import "@styles/Nav.css";
import { api } from "@/utils/api";
import { useUser, useUserUpdate } from "@components/AppWrapper";

const Nav = () => {
  const user = useUser();
  const userUpdate = useUserUpdate();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async() => {
    try{
      await api.post("/auth/logout");
      userUpdate(null);
      router.push("/login");
    }catch(error){
      console.error("Logout failed:", error);
    }
  }
  
  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <Link href="/">
          <img 
            src="/logo.png"
            alt="Home"
            className='navbar-logo'
          />
        </Link>
      </div>
      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        {user? (
          <>
            <Link href="/profile" className='navbar-link'>Profile</Link>
            <button className='navbar-button' onClick={handleLogout}>Logout</button>
          </>
        ):(          
          <>
            <Link onClick={() => setMenuOpen(false)} href="/login" className='navbar-link'>Login</Link>
            <Link onClick={() => setMenuOpen(false)} href="/signup" className='navbar-link'>Sign Up</Link>
          </>
        )}
      </div>
      <button className='hamburger' onClick={() => setMenuOpen((prev) => !prev)}>
        <span className='line'></span>
        <span className='line'></span>
        <span className='line'></span>
      </button>
    </nav>
  )
}

export default Nav