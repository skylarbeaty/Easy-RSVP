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
            <ul>
                {rsvps.map((rsvp) => (
                    <li className='text-center' key={rsvp.id}>
                        {rsvp.name}: {rsvp.response} ({rsvp.comment || "No comment"})
                    </li>
                ))}
            </ul>
            ) : (
                <>
                    <p className='text-center'>No RSVPs yet :c</p>
                    <p className='text-center'>Share the event link with your friends!</p>
                    {error && <p className="error">{error}</p>} 
                </>
            )}
        </>
    )
}

export default RSVPList