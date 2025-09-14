"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createClient } from '@/utils/supabase/client';
import { redirect } from "next/navigation";
import { Button } from '@/components/ui/button';
interface Room {
    id: number;
    created_at: string;
    room_price: number;
    room_name: string;
    room_capacity : string;
}

const RoomsPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                redirect("/sign-in");
            }
        };

        checkUser();
    }, [supabase]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('Rooms')
                    .select('*');

                if (fetchError) {
                    console.error("Supabase Error:", fetchError);
                    setError(`Failed to fetch rooms: ${fetchError.message}`);
                    setLoading(false);
                    return; // Stop execution on error
                }

                if (data) {
                    console.log("Supabase Data (Rooms):", data);
                    if (data.length > 0) {
                        setRooms(data);
                    }
                    else{
                       console.warn("Supabase returned empty array");
                       setRooms([]);
                    }
                }
                else {
                    console.warn("Supabase Data (Rooms): data is null or undefined");
                    setRooms([]);
                }
                setLoading(false);
            } catch (err: any) {
                console.error("Error during fetch:", err);
                setError(err.message || "An error occurred while fetching rooms.");
                setLoading(false);
            }
        };

        fetchRooms();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading rooms data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Available Rooms</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <Card key={room.id} className="bg-background text-foreground shadow-lg transition-transform transform hover:scale-105">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">{room.room_name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Room ID:</strong> {room.id}</p>
                            <p><strong>Created At:</strong> {new Date(room.created_at).toLocaleString('en-US', {year: 'numeric',month: '2-digit',day: '2-digit',})}</p>
                            <p><strong>Capacity:</strong> {room.room_capacity}</p>
                            <p><strong>Price:</strong> RM{room.room_price.toFixed(2)}</p>
                        </CardContent>
                        <div className="flex flex-col min-w-64 max-w-64 mx-auto p-4">
                            <Button 
                            className='bg-green-600 hover:bg-green-800'> Book now</Button>
                        </div>
                        
                    </Card>
                ))}
            </div>
            {rooms.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                    No rooms found.
                </div>
            )}
        </div>
    );
};

export default RoomsPage;
