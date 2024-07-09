import React from "react";
import Footer from "@/components/footer";
import ProfNavbar from "@/components/profnavbar";
import HomeCars from "@/components/home/carCard";

function Home(){
    return(
        <main>
            <ProfNavbar/>
            <HomeCars/>
            <Footer/>
        </main>   
    )
}

export default Home;