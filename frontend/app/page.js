"use client"

import LoginForm from "@components/LoginForm";
import CreateEventForm from "@components/CreateEventForm";
import { useUser } from "@components/AppWrapper";

const Home = () => {
  const user = useUser();

  return (
    <section>
      <h1 className="header text-center">RS<span className="gradient">EZ</span></h1>
      <p className="text-center">The easy way to share RSVPs</p>
      <><br /></>
      {user ? (
        <>
          <p className="text-center">Logged in as: {user.name}</p>
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