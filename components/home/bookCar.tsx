"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";

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

    type Car = {
        cuid: string;
        brand: string;
        name: string;
        description: string;
        year: string;
        pricePerDay: string;
        status: string;
        availability: { startDate: string; endDate: string };
        location: string;
        owner: string;
      };

export default function BookCar() {
    
    const [cuid, setCuid] = useState<string>('');
  const [car, setCar] = useState<Car | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);

    useEffect(() => {
        const pathArray = window.location.pathname.split('/');
        const carCuid = pathArray[2];
        setCuid(carCuid);
        console.log(carCuid)
    }, []);
    useEffect(() => {
        const usercar = async () => {
            try{
            const response = await fetch(`${endpoint}/cars/${cuid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            
    
            if (response.ok){
                const carData: Car = await response.json();
                setCar(carData);
                console.log("Car data:", carData);
      
                if (carData.owner) {
                  const ownerResponse = await fetch(`${endpoint}/users/getuser/${carData.owner}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": "Bearer " + token
                    }
                  });
      
                  if (ownerResponse.ok) {
                    const ownerData: Owner = await ownerResponse.json();
                    setOwner(ownerData);
                    console.log("Owner data:", ownerData);
                  } else {
                    console.error('Failed to fetch owner data');
                  }
                }
              } else {
                console.error('Failed to fetch car data');
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          if (cuid && token) {
            usercar();
          }
        }, [cuid, token]);

        return (
            <main>
              <div className="flex flex-col items-center justify-center">
                {car && (
                  <Card key={car.cuid} className="mt-10 h-[30rem] w-[22rem]">
                    <CardHeader>
                      <CardTitle>{car.brand} {car.name}</CardTitle>
                      <CardDescription>{car.year}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        <Label>Status: {car.status}</Label>
                        <br />
                        <Label>Price: Rs. {car.pricePerDay}/Day</Label>
                        <br />
                        <Label>Available Between: {car.availability.startDate} - {car.availability.endDate}</Label>
                        <br />
                        <Label>Location: {car.location}</Label>
                        <br />
                        <Label>Description: {car.description}</Label>
                        <br />
                        <Label>Owner: {owner ? owner.name : null}</Label>
                        <br />
                        <Label>Contact Owner: {owner ? owner.phone : null}</Label>
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="mt-5">
                      <Button variant='default' className="mr-5">Book</Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </main>
          );
}