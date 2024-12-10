"use client"

import "@styles/forms.css";
import { useUser } from "@components/AppWrapper";
import EventList from "@components/EventList";
import UserRSVPList from "@components/UserRSVPList";
import UserUpdateForm from "@components/UserUpdateForm";

const Profile = () => {
  const user = useUser();

  if (!user){
    return <div>Loading..</div>
  }

  return (
    <section>
      <h1>Profile</h1>
      <><br /></>
      <UserUpdateForm />
      <><br /></>
      <h1>Your Events</h1>
      <EventList />
      <><br /></>
      <h1>Your RSVPs</h1>
      <UserRSVPList />
    </section>
  )
}

export default Profile