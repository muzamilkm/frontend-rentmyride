import React from "react";
import Footer from "@/components/footer";
import ProfNavbar from "@/components/profnavbar";
import LoginForm from "@/components/login/loginform";
import { useRouter } from "next/navigation";

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }


function Login(){

    const router = useRouter();

    if (uuid !== null && token !== null) {
        router.push("/home");
    }
    return(
        <main>
            <ProfNavbar/>
            <LoginForm />
            <Footer/>
        </main>   
    )
}

export default Login;