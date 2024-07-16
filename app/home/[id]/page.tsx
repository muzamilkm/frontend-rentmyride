import Footer from "@/components/footer";
import BookCar from "@/components/home/bookCar";
import CarReviews from "@/components/home/carReviews";
import ProfNavbar from "@/components/profnavbar";


export default function CarInfo(){
    return(
        <main>
            <ProfNavbar />
            <BookCar/>
            <CarReviews />
            <Footer />
        </main>
    )
}