import React from "react";
import Footer from "@/components/footer";
import ProfNavbar from "@/components/profnavbar";
import LoginForm from "@/components/login/loginform";

function Login(){
    return(
        <main>
            <ProfNavbar/>
            <LoginForm />
            <Footer/>
        </main>   
    )
}

export default Login;