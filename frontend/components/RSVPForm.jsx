"use client"

import { useEffect, useState } from "react"
import Link from 'next/link';

import "@styles/forms.css";
import { useUser, useUserLoading } from "@components/AppWrapper";
import { api } from "@utils/api"
import Skeleton from "@components/Skeleton";

const RSVPForm = ({ eventId = null, onRSVP = () => {} }) => {
  const user = useUser();
  const userLoading = useUserLoading();

  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchExistingRSVP = async () => {
      try{
        const existingRSVP = await api.get(`/rsvps/event/${eventId}/user`)
        if (existingRSVP){
          setSubmitted(existingRSVP);
          setGuestName(existingRSVP.guestName || "");
          setResponse(existingRSVP.response || "");
          setComment(existingRSVP.comment || "");
        }
        else{
          setGuestName(user.name || "");
        }
      }catch (error){
        setError(error.message || "Failed to check RSVP");
      }
      setLoaded(true);
    }
    if (user)
      fetchExistingRSVP();
    
    if(!userLoading && user == null)
      setLoaded(true);
  }, [user, userLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if (!guestName){
        setError("Name is required");
        return;
      }
  
      if (!response){
        setError("Response is required");
        return;
      }

      let res;
      if (!updating)//submit new RSVP
        res = await api.post(`/rsvps`,{eventId, guestName, response, comment});
      else//update existing RSVP
        res = await api.patch(`/rsvps/${submitted.id}`,{guestName, response, comment});
      
      setError("");
      setSuccess(updating ? "RSVP updated successfully" : "RSVP submitted succesfully");
      setSubmitted(res);
      console.log(res);
      setUpdating(false);

      if (!user)//store locally to get picked up after login/sign up
        localStorage.setItem("guest_rsvp_id", res.id);

      onRSVP();
    }catch (error){
      setSuccess("");
      setError(error.message || "Failed to submit RSVP");
    }
  }
  
  const handleUpdateRSVP = () => {
    setError("");
    setSuccess("");
    setUpdating(true);
  }

  if(!loaded){
    return(
      <Skeleton type="form" itemCount={3}/>
    )
  }

  if (submitted && !updating) {
    return (
      <>
        <p className="text-center">Thanks for submitting your RSVP</p>
        {user ? (
          <button className="form-button" onClick={handleUpdateRSVP}>
            Update RSVP
          </button>
        ) : (
          <p className="text-center">
            Want to update your RSVP? <Link href="/login">Login</Link> or <Link href="/signup">Sign up</Link>
          </p>
        )}
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-center">Respond, if you please:</p>
      <div className="form-group">
        <input
          type="name"
          autoComplete="name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className={error=="Name is required" ? "error" : ""}
        />
        <label>Name *</label>
      </div>
      <div className="form-group">
        <select 
          value={response} 
          onChange={(e) => setResponse(e.target.value)}
          className={error=="Response is required" ? "error" : ""}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="maybe">Maybe</option>
        </select>
        <label>Response *</label>
      </div>
      <div className="form-group">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <label>Comment</label>
      </div>
      {error && <p className="error-message text-center">{error}</p>} 
      {success && <p className="text-center succes-text">{success}</p>}
      <div className="text-center">
        <button className="form-button" type="submit">
          {updating ? (
            "Update RSVP"
          ) : (
            "Submit RSVP"
          )}
        </button>
      </div>
    </form>
  )
}

export default RSVPForm