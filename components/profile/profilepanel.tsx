"use client"

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { useRouter } from "next/navigation";

const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

let uuid: string | null, token: string | null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('uuid');
      token = localStorage.getItem('token');
    }
export default function ProfPanel() {
    
    const router = useRouter()
    const [updated, setUpdated] = useState(false)

    const deleteprof = async () => {
        const password = (document.getElementById('delpass') as HTMLInputElement).value;
        const response = await fetch(`${endpoint}/users/deleteuser/${uuid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ uuid, password })
        });
        const data = await response.json();
        console.log(data);

        if (response.ok)
        {
            localStorage.removeItem('token');
            localStorage.removeItem('uuid');
            router.push('/login');
        }
        else
            alert("Incorrect password")
    }

    const accUpdate = async () => {
        setUpdated(false)
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

        if (response.ok)
        {
            setUpdated(true)
        }
    }

    const passUpdate = async () => {
        const password = (document.getElementById('current') as HTMLInputElement).value;
        const newpassword = (document.getElementById('new') as HTMLInputElement).value;
        const response = await fetch(`${endpoint}/users/updatepassword/${uuid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ uuid, password, newpassword })
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

    const [username, setUsername] = useState("");
    getUsername();
    async function getUsername() {
        const response = await fetch(`${endpoint}/users/getuser/${uuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        const data = await response.json();
        setUsername(data.name)
    };
    return (
        <main>
            <div className="min-h-screen w-64 bg-gray-100 dark:bg-gray-900 p-4">
            <div className="text-xl font-semibold flex flex-col items-center justify-center mb-10">
            <div className="flex">
                <img src='/profbanner.png' className='h-32 w-32 mb-10 dark:brightness-0 dark:invert-[1]'></img>
            </div>
            <h3>Welcome</h3>
            <h3>{username}</h3>
            </div>
            <ul>
                <Link className={buttonVariants({ variant: "link" })}
                href={`/profile/${uuid}`}>Profile</Link>
            </ul>
            <ul>
            <Link className={buttonVariants({ variant: "link" })}
                href={`/profile/${uuid}/mybookings`}>My Bookings</Link>
            </ul>
            <ul>
            <Link className={buttonVariants({ variant: "link" })}
                href={`/profile/${uuid}/myreviews`}>My Reviews</Link>
            </ul>
            
            </div>
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 min-h-screen w-64 bg-gray-100 dark:bg-gray-900 p-4">
            <div className="mt-auto">
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
                                        {updated ? <div className="text-green-500">Profile Updated!</div> : null}
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
            <div className='mt-9'>
            <Dialog>
                    <DialogTrigger className={buttonVariants({ variant: "destructive" })}>
                        Delete Account
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <h2>Delete Account</h2>
                            <DialogDescription>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Are you sure you want to delete your account?</CardTitle>
                                        <CardDescription className='text-destructive-foreground '>
                                            This action is irreversible. All your data will be lost. Enter password below to confirm.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Input id="delpass" type="password" placeholder="Enter your password" />
                                        <div onClick={deleteprof} className='mt-6'>
                                            <Button className={buttonVariants({ variant: "destructive" })}>Yes, delete my account</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            </div>
        </main>
    )};