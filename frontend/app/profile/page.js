"use client"

import Link from 'next/link';

import "@styles/forms.css";
import { useUser, useUserLoading } from "@components/AppWrapper";
import EventList from "@components/EventList";
import UserRSVPList from "@components/UserRSVPList";
import UserUpdateForm from "@components/UserUpdateForm";
import Skeleton from "@components/Skeleton";

const Profile = () => {
  const user = useUser();
  const userLoading = useUserLoading();

  if (userLoading){
    return (
      <section>
        <Skeleton type={"form"} itemCount={5} leftJustify={true}/>
        <h1>Your Events</h1>
        <Skeleton type={"spinner"} leftJustify={true}></Skeleton>
        <h1>Your RSVPs</h1>
        <Skeleton type={"spinner"} leftJustify={true}></Skeleton>
      </section>
    )
  }

  if (!userLoading && !user){
    return (
      <section>
        <p>To view your profile please: <Link href="/login">Login</Link></p>
        <p>If you don't have an accout: <Link href="/signup">Sign up</Link></p>
      </section>
    )
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