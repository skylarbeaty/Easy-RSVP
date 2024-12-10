"use client"

import { useEffect, useState } from "react";
import Link from 'next/link';
import { api } from "@/utils/api";
import { useUser } from "@components/AppWrapper";

const UserRSVPList = () => {
    const user = useUser();

    const [error, setError] = useState("");
    const [rsvps, setRsvps] = useState([]);

    useEffect(() => {
        const getRsvps = async (e) => {
            try{
                const res = await api.get(`/rsvps/user`);
                setRsvps(res);
                setError("");
            }catch (error){
                setError(error.message || "Failed to fetch RSVPs");
            }
        }
        if (user)
            getRsvps();
    }, [user])


    return (
        <>
            {rsvps.length > 0 ? (
                <table className="event-table">
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Event Date</th>
                            <th>Event Time</th>
                            <th>Response</th>
                            <th>Comment</th>
                            <th>Event Link</th>
                        </tr>
                    </thead>
                    <tbody>
                    {rsvps.map((rsvp) => (
                        <tr key={rsvp.id}>
                            <td>{rsvp.title}</td>
                            <td>{new Date(rsvp.date).toLocaleDateString()}</td>
                            <td>{new Date(rsvp.date).toLocaleTimeString()}</td>
                            <td>{rsvp.response}</td>
                            <td>{rsvp.comment}</td>
                            <td><Link href={"/events/" + rsvp.eventId}>View</Link></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>RSVPs will show up here</p>
            )}
            {error && <p className="error-message text-center">{error}</p>} 
        </>
    )
}

export default UserRSVPList