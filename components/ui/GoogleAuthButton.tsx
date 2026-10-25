"use client";

import { signInWithGoogle } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function GoogleAuthButton({ next }: { next?: string }){

    return (
        <div className="flex flex-col min-w-64 max-w-64 mx-auto">
            <Button
                onClick={() => signInWithGoogle(next)}
                variant={"outline"}
            >
                Continue With Google</Button>    
        </div>
    );
}


