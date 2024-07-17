"use client"

import React from "react";
import Footer from "@/components/footer";
import ProfNavbar from "@/components/profnavbar";
import HomeCars from "@/components/home/carCard";
import { useRouter } from "next/navigation";

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }

function Home(){

    const router = useRouter();

    if (uuid === null || token === null) {
        router.push("/login");
    }
    return(
        <main>
            <ProfNavbar/>
            <HomeCars/>
            <Footer/>
        </main>   
    )
}

export default Home;