import { Currency } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe") (process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
    try{
        const {amount} = await request.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "myr",
            // Automatically detects which payment are available
            automatic_payment_methods: {enabled: true},
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret});

    } catch (error) {
        console.error("Internal Error:", error);
        // Handle other erros (e.g., netowrk issuees, parsing errors)
        return NextResponse.json(
            {error: `Internal Server Error: ${error}`},
            {status: 500}
        );

    }
}