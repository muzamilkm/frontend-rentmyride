"use client"

import Layout from "@/components/profile/layout";
import UserBookings from "@/components/profile/userbookings";
import { useRouter } from "next/navigation";

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }


export default function MyBookings(){

    const router = useRouter();
    if (uuid === null || token === null) {
        router.push("/login");
    }
    return(
        <Layout>
            <UserBookings/>
        </Layout>
    )
}