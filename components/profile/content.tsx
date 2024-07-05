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

    const router = useRouter()
    const [updated, setUpdated] = useState()

    const accUpdate = async () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('Email') as HTMLInputElement).value;
        const phone = (document.getElementById('Phone') as HTMLInputElement).value;
        const location = (document.getElementById('Location') as HTMLInputElement).value;
        console.log(name + email + phone + location)
        const response = await fetch(`${endpoint}/users/updateuser/${uuid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ uuid, name, email, phone, location })
        });
        const data = await response.json();
        console.log(data);

        
    }

    const passUpdate = async () => {
        const current = (document.getElementById('current') as HTMLInputElement).value;
        const newpass = (document.getElementById('new') as HTMLInputElement).value;
        const response = await fetch(`${endpoint}/users/updatepassword/${uuid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ current, newpass })
        });
        const data = await response.json();
        console.log(data);

        if (response.ok)
        {
            localStorage.removeItem('token');
            localStorage.removeItem('uuid');
            router.push('/login');
        }
    }

    return (
        <main>
            <h1 className='text-xl font-semibold'>My Cars</h1>
            {/*Get and display user cars  */}
            <div className="flex hover:cursor-pointer mt-4">
                <Link className={buttonVariants({ variant: "default" })}
                href={`/profile/${uuid}/addcar`}>Add Car</Link>
            </div>

            <div className="mt-9">
                <Dialog>
                    <DialogTrigger className={buttonVariants({ variant: "default" })}>
                        Edit Profile
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <h2>Edit Your Profile</h2>

                            <DialogDescription>
                                <Tabs>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="account">Account</TabsTrigger>
                                        <TabsTrigger value="password">Password</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="account">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Account</CardTitle>
                                            <CardDescription>
                                            Make changes to your account here. Click save when you&apos;re done.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-1">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" />
                                            </div>
                                            <div className="space-y-1">
                                            <Label htmlFor="Email">Email</Label>
                                            <Input id="Email" />
                                            </div>
                                            <div className="space-y-1">
                                            <Label htmlFor="Phone">Phone</Label>
                                            <Input id="Phone" />
                                            </div>
                                            <div className="space-y-1">
                                            <Label htmlFor="Location">Location</Label>
                                            <Input id="Location" />
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <div onClick={accUpdate}>
                                            <Button>Save changes</Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                    </TabsContent>
                                    <TabsContent value="password">
                                    <Card>
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>
                                        Change your password here. After saving, you&apos;ll be logged out.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                        <Label htmlFor="current">Current password</Label>
                                        <Input id="current" type="password" />
                                        </div>
                                        <div className="space-y-1">
                                        <Label htmlFor="new">New password</Label>
                                        <Input id="new" type="password" />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div onClick={passUpdate}>
                                            <Button>Save Password</Button>
                                        </div>
                                    </CardFooter>
                                    </Card>
                                    </TabsContent>
                                </Tabs>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    )
}