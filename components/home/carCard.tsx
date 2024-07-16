"use client"

import { Label } from "@radix-ui/react-dropdown-menu";
import { Link } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const endpoint=process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }

    type Owner = {
        uuid: string;
        name: string;
        phone: string;
    };

export default function HomeCars() {

    console.log(token)
    const [userCars, setUserCars] = useState<{ cuid: string, brand: string, name: string, description: string, year: string, pricePerDay: string, status: string, availability: { startDate: string, endDate: string }, location: string, owner: string }[]>([]);
     const [owners, setOwners] = useState<Record<string, Owner>>({});

     useEffect(() => {
        const usercars = async () => {
            const response = await fetch(`${endpoint}/cars/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            const data = await response.json();
            console.log(data);
            setUserCars(data);
    
            const ownersData: Record<string, Owner> = {};
            if(data){
            for (const car of data) {
                if (!ownersData[car.owner]) {
                    const ownerResponse = await fetch(`${endpoint}/users/getuser/${car.owner}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + token
                        }
                    });
                    const ownerData = await ownerResponse.json();
                    ownersData[car.owner] = ownerData;
                }
            }
            }
            setOwners(ownersData);
        }
        usercars();}, [])

        const router = useRouter()

    const bookCar = (cuid: string) => async () => {
        router.push(`/home/${cuid}`)
    }

    return(
        <main className="mb-10">
            <h1 className='text-xl font-semibold items-center justify-center flex flex-col mt-10'>Available Cars</h1>
            <div className="flex flex-wrap justify-start gap-4 p-4">
            {Array.isArray(userCars) && userCars.map((car) => (
                <Card key={car.cuid} className="mt-10 h-[30rem] w-[22rem]">
                    <CardHeader>
                        <CardTitle>{car.brand} {car.name}</CardTitle>
                        <CardDescription>{car.year}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                        <Label>Status: {car.status}</Label>
                        <br></br>
                        <Label>Price: Rs. {car.pricePerDay}/Day</Label>
                        <br></br>
                        <Label>Available Between: {car.availability.startDate} - {car.availability.endDate}</Label>
                        <br></br>
                        <Label>Location: {car.location}</Label>
                        <br></br>
                        <Label>Description: {car.description}</Label>
                        <br></br>
                        <Label>Owner: {owners[car.owner] ? owners[car.owner].name : null}</Label>
                        <br></br>
                        <Label>Contact Owner: {owners[car.owner] ? owners[car.owner].phone : null}</Label>
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="mt-5">
                        <Button variant='default' className="mr-5" onClick={bookCar(car.cuid)}>View Info</Button>
                    </CardFooter>
                </Card>
              ))}
              </div>


            
        </main>
    )
}