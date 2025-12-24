export default async function PaymentSuccess ({
    searchParams,
}: {
    searchParams: Promise<{amount?: string}>;
}){
    const {amount} = await searchParams
    return (
        <main>
            <div className="">
                <h1>Thank you</h1>
                <h2>You successfully sent</h2>

                <div className="">${amount}</div>
            </div>
        </main>
    )
}