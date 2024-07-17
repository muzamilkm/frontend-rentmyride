"use client"

import UserCarBookings from "@/components/profile/carbookings";
import Layout from "@/components/profile/layout";
import { useRouter } from "next/navigation";

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }


export default function CarBookings(){

    const router = useRouter();
    if (uuid === null || token === null) {
        router.push("/login");
    }
    return (
        <Layout>
            <UserCarBookings/>
        </Layout>
    )
}