import React, { useState, useEffect } from 'react'

const RSVPList = ({eventId}) => {
    const [rsvps, setRsvps] = useState([]);
    const [error, setError] = useState([]);

    useEffect(() => {
        const fetchRsvps = async () => {
            try{
                const res = await api(`rsvps/event/${eventId}`)
                setRsvps(res)
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
                {rwsvps.map((rsvp) => (
                    <li key={rsvp.id}>
                        {rsvp.name}: {rsvp.response} ({rsvp.comment || "No comment"})
                    </li>
                ))}
            </ul>
            ) : (
                <>
                    <p className='text-center'>No RSVPs yet :c</p>
                    <p className='text-center'>Share the event link with your friends!</p>
                </>
            )}
        </>
    )
}

export default RSVPList