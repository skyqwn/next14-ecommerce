import Link from "next/link";

import { auth } from "@/server/auth";
import { Button } from "../ui/button";
import UserButton from "./user-button";

const Nav = async () => {
  const session = await auth();
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between">
          <li className="flex flex-1">
            <Link href={"/"}>NEXT_SHOPPING</Link>
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button>
                <Link className="flex gap-2" href="/auth/login">
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session.expires} user={session.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
