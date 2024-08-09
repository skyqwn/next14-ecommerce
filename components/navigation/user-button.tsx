"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

const UserButton = ({ user }: Session) => {
  return (
    <div className="">
      <h2>{user?.email}</h2>
      <button onClick={() => signOut()}>sign out</button>
    </div>
  );
};

export default UserButton;
