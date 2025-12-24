'use client'

import React, {useEffect, useState} from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import convertToSubcurrency from "@/lib/converttoSubcurrency"
import { SubmitButton } from "./submit-button"

const CheckoutPage = ({amount}: {amount: number}) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [errorMessage, seterrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        fetch("/api/create-payment-intent",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({amount: convertToSubcurrency(amount) }),
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    },[amount])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        setLoading(true);

        if(!stripe || !elements){
            return;
        }

        const {error: submitError} = await elements.submit();

        if(submitError){
            seterrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        // Confirm payment
        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams : {
                return_url: `http://localhost:3000/payment-success?amount=${amount}`
            }
        })

        if (error){
            seterrorMessage(error.message)
        } else {

        }

        setLoading(false)
    };

    if(!clientSecret || !stripe || !elements) {
        return (<h1 className="font-bold">Loading....</h1>)
    }
    return(
        <form onSubmit={handleSubmit} className="p-6">
            {clientSecret && <PaymentElement /> }

            {errorMessage && <div className="">{errorMessage}</div>}
            

            <SubmitButton disabled={!stripe || loading} className="w-full mt-4 p-6">
                {!loading ?`Pay RM${amount}` : "Processing...."}
            </SubmitButton>
        </form>
    )


}

export default CheckoutPage;