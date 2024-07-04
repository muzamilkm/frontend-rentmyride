"use client"

import { useState } from "react";

const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT
export default function ProfPanel() {

    const [username, setUsername] = useState("");
    getUsername();
    async function getUsername() {
        const response = await fetch(`${endpoint}/users/getuser/`+localStorage.getItem('uuid'), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });
        const data = await response.json();
        setUsername(data.name)
    };
    return (
        <main>
            <div className="min-h-screen w-64 bg-gray-100 dark:bg-gray-900 p-4">
            <div className="font-semibold mb-4 flex flex-col items-center justify-center">
            <h3>Welcome</h3>
            <h3>{username}</h3>
            </div>
            <ul>
                <li className="mb-2">
                <a href="#" className="text-gray-800 dark:text-gray-200">Dashboard</a>
                </li>
                <li className="mb-2">
                <a href="#" className="text-gray-800 dark:text-gray-200">Profile</a>
                </li>
                <li className="mb-2">
                <a href="#" className="text-gray-800 dark:text-gray-200">Settings</a>
                </li>
                {/* Add more sidebar items here */}
            </ul>
            </div>
        </main>
    )};