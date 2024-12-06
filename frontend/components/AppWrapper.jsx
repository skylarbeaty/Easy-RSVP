"use client"

import React, { useContext, useEffect, useState} from "react";
import { api } from "@utils/api";

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

export function useUser (){
    return useContext(UserContext);
}

export function useUserUpdate (){
    return useContext(UserUpdateContext);
}

const AppWrapper = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        async function fetchUser() {
            try{
                const res = await api.get("/auth/me");
                setUser(res.user);
            } catch (error){
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    if (loading){
      return <div>Loading..</div>
    }

    return (
        <UserContext.Provider value = {user}>
            <UserUpdateContext.Provider value = {setUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    )
}

export default AppWrapper