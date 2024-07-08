"use client"

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { addDays, format } from "date-fns"
import { z } from "zod";
import { useForm } from 'react-hook-form'

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

    const formSchema = z.object({
        name: z.string().min(1, { message: 'Name must be at least 1 character long' }),
        brand: z.string().min(1, { message: 'Brand must be at least 1 character long' }),
        year: z.string().min(4, { message: 'Year must be at least 4 characters long' }),
        status: z.string().min(1),
        pricePerDay: z.string().min(1, { message: 'Price per day must be at least 1 character long' }),
        availability: z.object({
            startDate: z.string().min(1, { message: 'Start date must be at least 1 character long' }),
            endDate: z.string().min(1, { message: 'End date must be at least 1 character long' }),
        }),
        location: z.string().min(1, { message: 'Location must be at least 1 character long' }),
        description: z.string(),
    })
    

export default function ProfContent() {

    const [userCars, setUserCars] = useState<{ cuid: string, brand:string, name: string, description: string,
        year: string, pricePerDay: string, status: string, availability: {startDate: string, endDate: string},
        location: string, owner: string
     }[]>([]);
     const [owners, setOwners] = useState<Record<string, Owner>>({});
    useEffect(() => {
    const usercars = async () => {
        const response = await fetch(`${endpoint}/cars/getByOwner/${uuid}`, {
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
        setOwners(ownersData);
    }
    usercars();}, [])

    console.log(userCars)
    console.log(owners)

    const router = useRouter()

    const editCar = (cuid: string) => async () => {
        router.push(`/profile/${uuid}/editcar/${cuid}`)
    }

    
    return (
        <main>
            <h1 className='text-xl font-semibold'>My Cars</h1>
            <div className="flex flex-wrap justify-start gap-4 p-4">
            {userCars.map((car) => (
                <Card key={car.cuid} className="mt-10 h-[24rem] w-[22rem]">
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
                        <Button variant='default' className="mr-5" onClick={editCar(car.cuid)}>Edit</Button>
                        <Button variant='destructive'>Delete</Button>
                    </CardFooter>
                </Card>
              ))}
              </div>
            <div className="flex hover:cursor-pointer mt-4">
                <Link className={buttonVariants({ variant: "default" })}
                href={`/profile/${uuid}/addcar`}>Add Car</Link>
            </div>

            
        </main>
    )
}