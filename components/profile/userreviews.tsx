"use client"

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";

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

    type Review = {
        ruid: string;
        car: string;
        reviewer: string;
        rating: string;
        comment: string;
    }

export default function UserReviews(){

    const [reviews, setReviews] = useState<Review[]>([]);
    const [cars, setCars] = useState<Record<string, Car>>({});

    useEffect(() => {
        const getReviews = async () => {
            try {
              const response = await fetch(`${endpoint}/reviews/user/${uuid}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
                }
              });
              const data = await response.json();
              console.log("review data: ", data);
              setReviews(data);
    
              const carsData: Record<string, Car> = {};
              if (data) {
                for (const review of data) {
                  if (!carsData[review.car]) {
                    const carResponse = await fetch(`${endpoint}/cars/${review.car}`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                      }
                    });
                    if (response.ok){
                    const carData = await carResponse.json();
                    console.log("carData" + carData)
                    carsData[review.car] = carData;
                    }
                    else{
                        const carError = await carResponse.json()
                        console.log("Error getting cars " + carError)
                    }
                  }
                }
              }
              setCars(carsData);
              console.log("reviews:" + cars)
            } catch (error) {
              console.log("Unexpected error: ", error);
            }
        };
    
        getReviews();
      }, []);

      const deleteReview = async (ruid: string) => {
        try {
          const response = await fetch(`${endpoint}/reviews/${ruid}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          });
          if (response.ok) {
            const data = await response.json();
            console.log("Review deleted: ", data);
            setReviews(reviews.filter((review) => review.ruid !== data.ruid));
          } else {
            const error = await response.json();
            console.log("Error deleting review: ", error);
          }
        } catch (error) {
          console.log("Unexpected error: ", error);
        }
      }
    return(
        <main>
      <h1 className="flex flex-col items-center justify-center text-xl">My Reviews</h1>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {Array.isArray(reviews) && reviews.map((review) => {
          const car = cars[review.car];
          return (
            <div key={review.ruid} className="flex flex-col items-center justify-center border border-gray-200 p-4 m-4">
              {car ? (
                <>
                  <h2 className="flex flex-col justify-center items-center">{car.brand} {car.name}</h2>
                  <p>{car.year}</p>
                </>
              ) : (
                <p>Loading car data...</p>
              )}
              <br />
              <p>Rating: {review.rating}</p>
              {review.comment && <p>Comment: {review.comment}</p>}

              <Button variant="default" className="mt-5">Edit Review</Button>
              <Dialog>
                <DialogTrigger>
              <Button variant="destructive" className="mt-5">Delete Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete Review</DialogTitle>
              <p>Are you sure you want to delete this review?</p>
              <div className="flex flex-wrap">
              <Button variant="destructive" className="mt-5 w-[5rem] h-auto mr-5" onClick={() => deleteReview(review.ruid)}>Yes</Button>
              <Button variant="default" className="mt-5 w-[5rem] h-auto">No</Button>
              </div>
              </DialogContent>
              </Dialog>
            </div>
          );
        })}
      </div>
    </main>
  );
}