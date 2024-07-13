"use client"

import { use, useEffect, useState } from "react";


const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

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

    type Review = {
        ruid: string;
        car: string;
        reviewer: string;
        rating: string;
        comment: string;
    }

export default function CarReviews() {

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewers, setReviewers] = useState<Record<string, Owner>>({});
    const [cuid, setCuid] = useState<string>('');

    useEffect(() => {
        const pathArray = window.location.pathname.split('/');
        const carCuid = pathArray[2];
        setCuid(carCuid);
        console.log(carCuid)
    }
    , []);

    useEffect(() => {
        const getReviews = async () => {
          if (cuid) {
            try {
              const response = await fetch(`${endpoint}/reviews/${cuid}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
                }
              });
              const data = await response.json();
              console.log("review data: ", data);
              setReviews(data);
    
              const reviewersData: Record<string, Owner> = {};
              if (data) {
                for (const review of data) {
                  if (!reviewersData[review.reviewer]) {
                    const reviewerResponse = await fetch(`${endpoint}/users/getuser/${review.reviewer}`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                      }
                    });
                    const reviewerData = await reviewerResponse.json();
                    reviewersData[review.reviewer] = reviewerData;
                  }
                }
              }
              setReviewers(reviewersData);
            } catch (error) {
              console.log("Unexpected error: ", error);
            }
          }
        };
    
        getReviews();
      }, [cuid]);
    return (
        <main>
        
        <h1 className="mt-10 flex flex-col items-center justify-center">Car Reviews</h1>
        <div className="flex flex-wrap justify-start gap-4 p-4">
        {reviews.map((review) => {
                return (
                    <div key={review.ruid} className="flex flex-col items-center justify-center border border-gray-200 p-4 m-4">
                        <p>Rating: {review.rating}</p>
                        {review.comment ?
                        <p>Comment: {review.comment}</p> : null}
                        <p>Reviewer: {reviewers[review.reviewer]?.name}</p>
                    </div>
                );
        })}
        </div>
        </main>
    );
    }