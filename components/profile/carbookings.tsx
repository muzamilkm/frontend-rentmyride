"use client"
import { useEffect, useState } from "react";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";


const endpoint=process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }
    type Booking = {
        buid: string;
        car: string;
        renter: string;
        renting: {
            startDate: string;
            endDate: string;
        };
        totalCost: string;
        status: string;
    }
    type User = {
        uuid: string;
        name: string;
        phone: string;
    };

export default function UserCarBookings(){

    const [cuid, setCuid] = useState<string>('');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<Record<string, User>>({});
    
    useEffect(() => {
        const pathArray = window.location.pathname.split('/');
        const carCuid = pathArray[4];
        setCuid(carCuid);
        console.log(carCuid)
    }, []);

    useEffect(() => {
        const getBookings = async () => {
            if (!cuid) return; 
            try {
              const response = await fetch(`${endpoint}/bookings/car/${cuid}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
                }
              });
              if (response.ok){
              const data = await response.json();
              console.log("booking data: ", data);
              setBookings(data);

              const usersData: Record<string, User> = {};
              if (data) {
                for (const booking of data) {
                  if (!usersData[booking.renter]) {
                    const userResponse = await fetch(`${endpoint}/users/getuser/${booking.renter}`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                      }
                    });
                    const userData = await userResponse.json();
                    usersData[booking.renter] = userData;
                  }
                }
                setUsers(usersData);
              }
            }
            } catch (error) {
                console.log("error", error);
            }
          };
          getBookings();
    }, [cuid]);

    return (
        <main>
            <h1 className="mt-10 flex flex-col items-center justify-center text-xl">Car Bookings</h1>
            <div className="flex flex-wrap justify-start gap-4 p-4">
            {Array.isArray(bookings) && bookings.map((booking) => (
                <Card key={booking.buid} className="h-auto w-[25rem]">
                    <CardTitle></CardTitle><div className="ml-5 mt-5 mb-5">
                    <p>Renting Between: {booking.renting.startDate} - {booking.renting.endDate}</p>
                    <p>Renter: {users[booking.renter]?.name}</p>
                    <p>Phone: {users[booking.renter]?.phone}</p>
                    <p>Total Cost: {booking.totalCost}</p>
                    <p>Status: {booking.status}</p>
                    <Button variant='default' className="mt-5">Update Status</Button>
                    </div>
                </Card>
            ))}
            </div>
        </main>
    )
}