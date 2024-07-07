import { Input } from "@/components/ui/input";
import { z } from 'zod'
import { useState } from 'react'
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

const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

const formSchema = z.object({
    name: z.string().min(1, { message: 'Name must be at least 1 character long' }),
    brand: z.string().min(1, { message: 'Brand must be at least 1 character long' }),
    year: z.string().min(4, { message: 'Year must be at least 4 characters long' }),
    pricePerDay: z.string().min(1, { message: 'Price per day must be at least 1 character long' }),
    availability: z.object({
        startDate: z.string().min(1, { message: 'Start date must be at least 1 character long' }),
        endDate: z.string().min(1, { message: 'End date must be at least 1 character long' }),
    }),
    location: z.string().min(1, { message: 'Location must be at least 1 character long' }),
    description: z.string(),
})

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }

export default function AddCar() {

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 6, 20),
        to: addDays(new Date(2024, 6, 20), 20),
      })
      const [added, setAdded] = useState(false)

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data)
        console.log("date" + data.availability.startDate)
        try{
            setAdded(false)
            const response = await fetch(`${endpoint}/cars/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: data.name,
                    brand: data.brand,
                    year: data.year,
                    pricePerDay: data.pricePerDay,
                    startDate: data.availability.startDate,
                    endDate: data.availability.endDate,
                    location: data.location,
                    description: data.description,
                    owner: uuid
                })
            });
            if (response.ok) {
                setAdded(true)
            }
            else {
                const error = await response.json()
                console.error('Failed to add car')
                console.log(error)  
            }
        }
        catch (error) {
            console.error('Unexpected error: ', error)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            availability: {
                startDate: date?.from ? format(date.from, "yyyy-MM-dd") : '',
                endDate: date?.to ? format(date.to, "yyyy-MM-dd") : '',
            },
        }
    })
    return (
        <main>
            <div className="flex flex-col items-center justify-center h-screen">
            <h1 className='text-xl font-semibold items-center mb-10'>Add Car</h1>
            {added ? 
                <Alert className='h-200 w-200 mb-10'>
                    <AlertTitle>Car Added Successfully!</AlertTitle>
                </Alert>
                :
                null
            }
            <div className="max-w-lg mx-auto p-6 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white border border-white rounded-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="brand"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.brand?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.year?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="pricePerDay"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price Per Day</FormLabel>
                            <FormControl>
                                <Input placeholder="in PKR" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.pricePerDay?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="availability"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Choose the availability of your car</FormLabel>
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
                                        if (date?.from) {
                                            form.setValue("availability.startDate", format(date.from, "yyyy-MM-dd"));
                                        }
                                        if (date?.to) {
                                            form.setValue("availability.endDate", format(date.to, "yyyy-MM-dd"));
                                        }
                                    }}
                                    numberOfMonths={2}
                                />
                                </PopoverContent>
                            </Popover>
                        </FormItem>

                    )} />

                    <FormField control={form.control} name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Location of the car" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.location?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Optional: Note any damage, notable features etc." {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                        </FormItem>
                    )} />
                    
                    <div className="mt-8 flex items-center justify-center gap-4">
                    <Button type="submit">Add Car</Button>
                    </div>
                </form>
            </Form>
            </div>
            </div>
        </main>
    )}