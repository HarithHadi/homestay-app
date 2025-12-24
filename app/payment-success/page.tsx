export default function PaymentSuccess ({
    searchParams : {amount}
}: {
    searchParams: {amount: string};
}){
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