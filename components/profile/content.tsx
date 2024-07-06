"use client"

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";
import { useState } from 'react';


const endpoint=process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }
export default function ProfContent() {
    const usercars = async () => {
        const response = await fetch(`${endpoint}/cars/getByOwner/${uuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        const data = await response.json();
        console.log(data);
    }

    
    return (
        <main>
            <h1 className='text-xl font-semibold'>My Cars</h1>
            {/*Get and display user cars  */}
            <div className="flex hover:cursor-pointer mt-4">
                <Link className={buttonVariants({ variant: "default" })}
                href={`/profile/${uuid}/addcar`}>Add Car</Link>
            </div>

            
        </main>
    )
}