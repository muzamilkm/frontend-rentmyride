import Layout from "@/components/profile/layout";
import UserReviews from "@/components/profile/userreviews";
import { useRouter } from "next/navigation";

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }


export default function MyReviews(){
    const router = useRouter();
    if (uuid === null || token === null) {
        router.push("/login");
    }
    return(
        <main>
            <Layout>
                <UserReviews/>
            </Layout>
        </main>
    )
}