"use client"

import "@styles/tables.css";
import React, { useState, useEffect } from 'react'
import { api } from "@utils/api"

const RSVPList = ({eventId}) => {
    const [rsvps, setRsvps] = useState([]);
    const [error, setError] = useState([]);

    useEffect(() => {
        const fetchRsvps = async () => {
            try{
                const res = await api.get(`/rsvps/event/${eventId}`);
                setRsvps(res);
            }catch (error){
                setError(error.message || "Fialed to fetch event details");
            }
        }

        fetchRsvps();
    }, [eventId]);

    return (
        <>
            {rsvps.length > 0 ? (
            <table className="event-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Response</th>
                        <th>Date Responded</th>
                        <th>comment</th>
                    </tr>
                </thead>
                <tbody>
                {rsvps.map((rsvp) => (
                    <tr key={rsvp.id}>
                        <td>{rsvp.name}</td>
                        <td>Email</td>
                        <td>{rsvp.response}</td>
                        <td>{rsvp.dateResponded}</td>
                        <td>{rsvp.comment}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
                <>
                    <p>No RSVPs yet :c</p>
                    <p>Share the event link with your friends!</p>
                    {error && <p className="error">{error}</p>} 
                </>
            )}
        </>
    )
}

export default RSVPList