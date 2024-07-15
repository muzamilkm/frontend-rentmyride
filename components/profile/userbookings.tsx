"use client"

import { useEffect, useState } from "react";
import { Button } from "../ui/button";


const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }

    type Car = {
        cuid: string;
        name: string;
        brand: string;
        year: string;
    };

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

export default function UserBookings(){

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [cars, setCars] = useState<Record<string, Car>>({});

    useEffect(() => {
        const getBookings = async () => {
            try {
              const response = await fetch(`${endpoint}/bookings/user/${uuid}`, {
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

              const carsData: Record<string, Car> = {};
              if (data) {
                for (const booking of data) {
                  if (!carsData[booking.car]) {
                    const carResponse = await fetch(`${endpoint}/cars/${booking.car}`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                      }
                    });
                    if (response.ok){
                    const carData = await carResponse.json();
                    console.log("carData" + carData)
                    carsData[booking.car] = carData;
                  }
                  else{
                    const carError = await carResponse.json()
                    console.log("Error getting cars " + carError)
                }
                }
              }
              setCars(carsData);
            }
              }
              else{
                    const error = await response.json()
                    console.log("Error getting bookings " + error)
              }
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
        }
        getBookings();
      }, []);

    const deleteBooking = async (buid: string) => {
        try {
          const response = await fetch(`${endpoint}/bookings/${buid}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          });
          if (response.ok) {
            const data = await response.json();
            console.log("Booking deleted: ", data);
            setBookings(bookings.filter((booking) => booking.buid !== buid));
          } else {
            const error = await response.json();
            console.error("Error deleting booking: ", error);
          }
        } catch (error) {
          console.error("Unexpected error: ", error);
        }
        }
    return(
        <div>
        <h1 className="mt-10 flex flex-col items-center justify-center text-xl">My Bookings</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
            {Array.isArray(bookings) && bookings.map((booking) => {
                const car = cars[booking.car];
                return (
                    <div key={booking.buid} className="flex flex-col items-center justify-center border border-gray-200 p-4 m-4">
                    {car ? (
                        <>
                        <h2 className="text-xl font-bold">{car.brand} {car.name}</h2>
                        <p>{car.year}</p>
                        <br></br>
                        </>
                    ) : (
                        <p>Loading car data...</p>
                    )}
                        <p>Start Date: {booking.renting.startDate}</p>
                        <p>End Date: {booking.renting.endDate}</p>
                        <p>Total Cost: {booking.totalCost}</p>
                        <p>Status: {booking.status}</p>
                        <Button className= "mt-5" variant="destructive" onClick={() => deleteBooking(booking.buid)}>Delete Booking</Button>
                    </div>
                );
            }
            )}
        </div>
        </div>
    )
}