"use client"

import ProfPanel from "@/components/profile/profilepanel";
import ProfNavbar from "@/components/profnavbar";
import { useRouter } from "next/navigation";

let uuid: string | null, token: string | null;
  if (typeof window !== 'undefined') {
    uuid = localStorage.getItem('uuid');
    token = localStorage.getItem('token');
  }

export default function Profile() {

    const router = useRouter()
    if (uuid == null || token == null)
        router.push('/login')
    return (
        <main>
            <ProfNavbar/>
            <ProfPanel/>
        </main>
    )};