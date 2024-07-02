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

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    fullname: z.string().min(2, { message: 'Full name must be at least 2 characters long' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 characters long' }),
    location: z.string().min(2, { message: 'Location must be at least 2 characters long' }),
})

export default function SignUpForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
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

                    <FormField control={form.control} name="fullname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.fullname?.message}</FormMessage>
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