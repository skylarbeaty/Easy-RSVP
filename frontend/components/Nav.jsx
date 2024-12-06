"use client"

import Link from 'next/link';
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { useUser, useUserUpdate } from "@components/AppWrapper";

const Nav = () => {
  const user = useUser();
  const userUpdate = useUserUpdate();
  const router = useRouter();

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
      <div className='navbar-right'>
        {user? (
          <>
            <Link href="/user" className='navbar-link'>Profile</Link>
            <button className='navbar-button' onClick={handleLogout}>Logout</button>
          </>
        ):(          
          <>
            <Link href="/login" className='navbar-link'>Login</Link>
            <Link href="/signup" className='navbar-link'>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav