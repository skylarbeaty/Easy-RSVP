"use client"

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useUser } from "@components/AppWrapper";

const UserRSVPList = () => {
    const user = useUser();

    const [error, setError] = useState("");
    const [rsvps, setRsvps] = useState([]);

    useEffect(() => {
        const getRsvps = async (e) => {
            try{
                const res = await api.get(`/rsvps/user/${user.id}`);
                setRsvps(res);
            }catch (error){
                setError(error.toString());
            }
        }
        if (user)
            getRsvps();
    }, [user])


    return (
        <>
            {rsvps.length > 0 ? (
                <ul>
                    {rsvps.map((rsvp) => (
                        <li key={rsvp.id}>
                            RSVP info
                        </li>
                    ))}
                </ul>
            ) : (
                <p>RSVPs will show up here</p>
            )}
        </>
    )
}

export default UserRSVPList