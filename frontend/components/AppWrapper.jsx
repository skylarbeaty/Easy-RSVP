"use client"

import React, { useContext, useEffect, useState} from "react";
import { api } from "@utils/api";

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();
const UserLoadingContext = React.createContext();

export function useUser (){
    return useContext(UserContext);
}

export function useUserUpdate (){
    return useContext(UserUpdateContext);
}

export function useUserLoading (){
    return useContext(UserLoadingContext);
}

const AppWrapper = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        async function fetchUser() {
            try{
                const res = await api.get("/auth/me");
                setUser(res.user);

                // handle guest RSVPs after next login/signup
                const guestRsvpId = localStorage.getItem("guest_rsvp_id");
                if (guestRsvpId && res.user){
                    await api.patch(`/rsvps/${guestRsvpId}/capture`);
                    localStorage.removeItem("guest_rsvp_id");
                }
            } catch (error){
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value = {user}>
            <UserUpdateContext.Provider value = {setUser}>
                <UserLoadingContext.Provider value = {loading}>
                    {children}
                </UserLoadingContext.Provider>
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    )
}

export default AppWrapper