"use client"

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';


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

    
    return (
        <main>
            <h1 className='text-xl font-semibold'>My Cars</h1>
            {userCars.map((car) => (
                <Card key={car.cuid} className="mt-10 h-[25rem] w-[20rem]">
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
                        <Button variant='default' className="mr-5">Edit</Button>
                        <Button variant='destructive'>Delete</Button>
                    </CardFooter>
                </Card>
              ))}
            <div className="flex hover:cursor-pointer mt-4">
                <Link className={buttonVariants({ variant: "default" })}
                href={`/profile/${uuid}/addcar`}>Add Car</Link>
            </div>

            
        </main>
    )
}