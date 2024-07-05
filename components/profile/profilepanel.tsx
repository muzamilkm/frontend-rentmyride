"use client"

import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "../ui/button";

const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }
export default function ProfPanel() {
    
    const [username, setUsername] = useState("");
    getUsername();
    async function getUsername() {
        const response = await fetch(`${endpoint}/users/getuser/${uuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        const data = await response.json();
        setUsername(data.name)
    };
    return (
        <main>
            <div className="min-h-screen w-64 bg-gray-100 dark:bg-gray-900 p-4">
            <div className="text-xl font-semibold flex flex-col items-center justify-center mb-10">
            <div className="flex">
                <img src='/profbanner.png' className='h-32 w-32 mb-10 dark:brightness-0 dark:invert-[1]'></img>
            </div>
            <h3>Welcome</h3>
            <h3>{username}</h3>
            </div>
            <ul>
                <Link className={buttonVariants({ variant: "link" })}
                href={`/profile/${uuid}`}>Profile</Link>
            </ul>
            <ul>
            <Link className={buttonVariants({ variant: "link" })}
                href={`/profile/${uuid}/mybookings`}>My Bookings</Link>
            </ul>
            <ul>
            <Link className={buttonVariants({ variant: "link" })}
                href={`/profile/${uuid}/myreviews`}>My Reviews</Link>
            </ul>
            </div>
        </main>
    )};