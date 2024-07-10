import Footer from "@/components/footer";
import BookCar from "@/components/home/bookCar";
import ProfNavbar from "@/components/profnavbar";


export default function CarInfo(){
    return(
        <main>
            <ProfNavbar />
            <BookCar/>
            <Footer />
        </main>
    )
}