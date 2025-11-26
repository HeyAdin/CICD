"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { SendMoney } from "../app/lib/actions/sendMoney";

export function P2PTransfer() {
    const [amount, setAmount] = useState(0);
    const [number, setNumber] = useState("");
    return <div className="h-[90vh]">
        <Center>
            <Card title="Transfer Money">
                <div className="min-w-72 flex flex-col items-center">
                    <TextInput placeholder="Number" label="Number" onChange={(value) => { setNumber(value) }} />
                    <TextInput placeholder="Amount" label="Amount" onChange={(value) => { setAmount(Number(value)) }} />
                    <Button onClick={async() => {await SendMoney(number,amount*100)}} >
                        Send
                    </Button>
                </div>
            </Card>
        </Center>
    </div>
}