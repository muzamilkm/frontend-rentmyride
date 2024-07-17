import Footer from "@/components/footer";
import BookCar from "@/components/home/bookCar";
import CarReviews from "@/components/home/carReviews";
import ProfNavbar from "@/components/profnavbar";
import { useRouter } from "next/navigation";


let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }


export default function CarInfo(){

    const router = useRouter();

    if (uuid === null || token === null) {
        router.push("/login");
    }
    return(
        <main>
            <ProfNavbar />
            <BookCar/>
            <CarReviews />
            <Footer />
        </main>
    )
}