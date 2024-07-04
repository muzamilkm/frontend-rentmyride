"use client"
import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
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
import { useRouter } from 'next/navigation'

const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export default function LoginForm() {

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            const response = await fetch(`${endpoint}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            if (response.ok) {
                const responseData = await response.json()
                localStorage.setItem('token', responseData.token)
                localStorage.setItem('uuid', responseData.userId)
                alert('Login successful')
                router.push('/home')
            } else {
                alert('Login failed')
            }
        }
        catch(error){
            console.error('An unexpected error occurred: ', error)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
                <h1 className='mb-10'>Login</h1>
                <div className="max-w-lg mx-auto p-6 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white border border-white rounded-lg">
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
                    
                    <div className="mt-8 flex items-center justify-center gap-4">
                    <Button type="submit">Login</Button>
                    </div>
                </form>
            </Form>
            </div>
        </div>
    )
}