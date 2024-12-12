"use client"

import LoginForm from "@components/LoginForm";
import CreateEventForm from "@components/CreateEventForm";
import { useUser, useUserLoading } from "@components/AppWrapper";
import Skeleton from "@components/Skeleton";

const Home = () => {
  const user = useUser();
  const userLoading = useUserLoading();

  return (
    <section className="justify-center">
      <h1 className="header text-center">RS<span className="gradient">EZ</span></h1>
      <p className="text-center">The easy way to share RSVPs</p>
      <><br /></>
      {userLoading ? (
        <Skeleton type={"form"} itemCount={3}/>
      ) : user ? (
        <>
          <CreateEventForm />
        </>
      ) : (
        <>
          <p className="text-center">Login to create an event</p>
          <LoginForm />
        </>
      )}
    </section>
  )
}

export default Home