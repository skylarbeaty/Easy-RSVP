import Link from 'next/link';
import { apiFetch as api } from "@/utils/api";

const Nav = ({ user, onLogout }) => {
  const handleLogout = async() => {
    try{
      await api("/auth/logout", { 
        method: "POST", 
        body: JSON.stringify({})});
      onLogout();
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