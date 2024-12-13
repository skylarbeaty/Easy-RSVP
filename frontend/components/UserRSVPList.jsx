"use client"

import { useEffect, useState } from "react";
import Link from 'next/link';
import { api } from "@/utils/api";
import { useUser, useUserLoading  } from "@components/AppWrapper";
import Skeleton from "@components/Skeleton";

const UserRSVPList = () => {
    const user = useUser();
    const userLoading = useUserLoading();

    const [error, setError] = useState("");
    const [rsvps, setRsvps] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const getRsvps = async (e) => {
            try{
                const res = await api.get(`/rsvps/user`);
                setRsvps(res);
                setError("");
            }catch (error){
                setError(error.message || "Failed to fetch RSVPs");
            }
            setLoaded(true);
        }
        if (user)
            getRsvps();

        if (!userLoading && user == null)
            setLoaded(true);
    }, [user, userLoading])

    if (!loaded){
        return(
            <Skeleton type="spinner" leftJustify={true}/>
        )
    }

    return (
        <>
            {rsvps.length > 0 ? (
                <table className="event-table">
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Response</th>
                            <th>Comment</th>
                            <th>View</th>
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
                            <td>
                                <Link href={"/events/" + rsvp.eventId} className="justify-center">
                                    <img 
                                        src="/view.svg"
                                        alt="View Icon"
                                        className="table-icon"
                                    />
                                </Link>
                            </td>
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