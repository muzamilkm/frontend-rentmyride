"use client"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT
console.log(endpoint)

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    name: z.string().min(2, { message: 'Full name must be at least 2 characters long' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 characters long' }),
    location: z.string().min(2, { message: 'Location must be at least 2 characters long' }),
})

export default function SignUpForm() {

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const [signUp, setSignUp] = useState(false)

    const handleClick = () => {
        router.push('/login');
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if(values)
        {
            try{
                console.log(JSON.stringify(values))
            const response = await fetch(`${endpoint}users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })

            if(response.ok)
            {
                const responseData = await response.json()
                console.log('User signed up successfully', responseData);
                setSignUp(true)
                
            }
            else
            {
                const errorData = await response.json()
                console.log('User sign up failed', errorData)
            }
        }
        catch(error)
        {
            console.log('Failed to sign up', error)
        }
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AlertDialog open={signUp}>
                <AlertDialogContent>
                    <AlertDialogHeader>Sign Up Successful</AlertDialogHeader>
                    <AlertDialogAction>
                        <Button onClick={handleClick}>Login</Button>
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
            <h1 className='mb-10'>Sign Up And Join Us Today</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.location?.message}</FormMessage>
                        </FormItem>
                    )} />
                    <div className="mt-8 flex items-center justify-center gap-4">
                    <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}