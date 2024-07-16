"use client"

import { Input } from "@/components/ui/input";
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Alert, AlertTitle } from "../ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogHeader } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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

      const formSchema = z.object({
        renting: z.object({
            startDate: z.string().min(1, { message: 'Start date must be at least 1 character long' }),
            endDate: z.string().min(1, { message: 'End date must be at least 1 character long' }),
        }),
    })

    const reviewFormSchema = z.object({
      rating: z.string().min(1, { message: 'You must select a rating' }),
      comment: z.string()
  })

export default function BookCar() {

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
    const startDateString = new Date(data.renting.startDate);
    const endDateString = new Date(data.renting.endDate);
    const timeDifference = endDateString.getTime() - startDateString.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const totalPrice = daysDifference * parseInt(car?.pricePerDay || '0');
    if (uuid){
    try{
        const response = await fetch(`${endpoint}/bookings/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                car: cuid,
                startDate: data.renting.startDate,
                endDate: data.renting.endDate,
                renter: localStorage.getItem('uuid'),
                totalCost: totalPrice,
            })
        });
      
        if (response.ok) {
            console.log('Car booked successfully')
        }
        else {
            const error = await response.json()
            console.error('Failed to book car')
            console.log(error)  
        }
    }
    catch (error) {
        console.error('Unexpected error: ', error)
    }
  }
  }

  

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
      renting: {
          startDate: date?.from ? format(date.from, "yyyy-MM-dd") : '',
          endDate: date?.to ? format(date.to, "yyyy-MM-dd") : '',
      },
  }
})

const reviewForm = useForm<z.infer<typeof reviewFormSchema>>({
  resolver: zodResolver(reviewFormSchema),
})
    
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

        async function submitReview(data: z.infer<typeof reviewFormSchema>) {
          if (uuid){
          try{
              const response = await fetch(`${endpoint}/reviews/${cuid}`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify({
                      rating: data.rating,
                      comment: data.comment,
                      reviewer: uuid,
                  })
              });
            
              if (response.ok) {
                  console.log('Review posted successfully')
              }
              else {
                  const error = await response.json()
                  console.error('Failed to post review')
                  console.log(error)  
              }
          }
          catch (error) {
              console.error('Unexpected error: ', error)
          }
        }
        }

        return(
        <main>
      <div className="flex flex-col items-center justify-center">
        {car && (
          <Card key={car.cuid} className="mt-10 h-[30rem] w-[24rem]">
            <CardHeader>
              <CardTitle>{car.brand} {car.name}</CardTitle>
              <CardDescription>{car.year}</CardDescription>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <div className='mb-2'>
                <Label>Status: {car.status}</Label>
                <br />
                </div>
                <div className='mb-2'>
                <Label>Price: Rs. {car.pricePerDay}/Day</Label>
                <br />
                </div>
                <div className='mb-2'>
                <Label>Available Between: {car.availability.startDate} - {car.availability.endDate}</Label>
                <br />
                </div>
                <div className='mb-2'>
                <Label>Location: {car.location}</Label>
                <br />
                </div>
                <div className='mb-2'>
                <Label>Description: {car.description}</Label>
                <br />
                </div>
                <div className='mb-2'>
                <Label>Owner: {owner ? owner.name : null}</Label>
                <br />
                </div>
                <div className='mb-2'>
                <Label>Contact Owner: {owner ? owner.phone : null}</Label>
                </div>
              </CardDescription>
            </CardContent>
            <CardFooter className="mt-5">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='default' className="mr-5">Book</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book Car</DialogTitle>
                    <DialogDescription>
                      <Card>
                        <CardHeader>
                          <CardDescription>
                            Fill the required information. Click Book to confirm.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                              <FormField control={form.control} name="renting"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Choose the duration of renting</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                              "w-[300px] justify-start text-left font-normal",
                                              !date && "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                              date.to ? (
                                                <>
                                                  {format(date.from, "LLL dd, y")} -{" "}
                                                  {format(date.to, "LLL dd, y")}
                                                </>
                                              ) : (
                                                format(date.from, "LLL dd, y")
                                              )
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          initialFocus
                                          mode="range"
                                          defaultMonth={date?.from}
                                          selected={date}
                                          onSelect={(range) => {
                                            setDate(range);
                                            if (range?.from) {
                                              form.setValue("renting.startDate", format(range.from, "yyyy-MM-dd"));
                                            }
                                            if (range?.to) {
                                              form.setValue("renting.endDate", format(range.to, "yyyy-MM-dd"));
                                            }
                                          }}
                                          numberOfMonths={2}
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </FormItem>
                                )} />
                              <div className="mt-8 flex items-center justify-center gap-4">
                                <Button type="submit">Book Car</Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='default' className="mr-5">Leave a Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Review Car</DialogTitle>
                    <DialogDescription>
                      <Card>
                        <CardHeader>
                          <CardDescription>
                            Rented this car? Leave a review to assist others!
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Form {...reviewForm}>
                            <form onSubmit={reviewForm.handleSubmit(submitReview)}>
                              <FormField control={reviewForm.control} name="rating"
                                render={({ field }) => (
                                  <FormItem className="mb-6">
                                    <FormLabel>Chose a rating</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="w-[180px]">
                                              <SelectValue placeholder="Rating" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="1">1</SelectItem>
                                          <SelectItem value="2">2</SelectItem>
                                          <SelectItem value="3">3</SelectItem>
                                          <SelectItem value="4">4</SelectItem>
                                          <SelectItem value="5">5</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage>{reviewForm.formState.errors.rating?.message}</FormMessage>
                                  </FormItem>
                                )} />
                                <FormField control={reviewForm.control} name="comment"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Leave a comment</FormLabel>
                                      <Input {...field} placeholder="Optionally add a comment about your experience"/>
                                      <FormMessage>{reviewForm.formState.errors.comment?.message}</FormMessage>
                                  </FormItem>
                                )} />
                              <div className="mt-8 flex items-center justify-center gap-4">
                                <Button type="submit">Post Review</Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
          );
}