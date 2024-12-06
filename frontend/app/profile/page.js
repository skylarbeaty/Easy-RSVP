"use client"

import { useUser } from "@components/AppWrapper";
import EventList from "@components/EventList";
import UserRSVPList from "@components/UserRSVPList";

const Profile = () => {
  const user = useUser();

  return (
    <section>
      <h1>Profile</h1>
      <br></br>
      <label>Name:</label>
      <p>{user.name}</p>
      <label>Email:</label>
      <p>{user.email}</p>
      <label>User since:</label>
      <p>{user.dateCreated}</p>
      <EventList />
      <UserRSVPList />
    </section>
  )
}

export default Profile