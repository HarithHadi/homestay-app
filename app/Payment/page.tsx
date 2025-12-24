'use client'

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import convertToSubcurrency from "@/lib/converttoSubcurrency";
import CheckoutPage from "@/components/CheckoutPage";

if(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined){
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage(){
    const amount = 49.99;


    return(
        <>        
        <main className="bg-indigo-400 w-full">
            <Elements 
                stripe={stripePromise}
                options={{
                    mode: "payment",
                    amount: convertToSubcurrency(amount),
                    currency: "myr"
                    }}
            >
                <CheckoutPage amount={amount}/>


            </Elements>
        </main>
        
        </>
    )
}