"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FinanceCalculator() {
  const [price, setPrice] = useState(300000);
  const [deposit, setDeposit] = useState(0);
  const [interest, setInterest] = useState(11.75);
  const [term, setTerm] = useState(60);
  const [balloon, setBalloon] = useState(0);

  const loanAmount = price - deposit;
  const monthlyInterest = interest / 100 / 12;
  const numberOfPayments = term;
  const balloonAmount = (balloon / 100) * price;

  const monthlyPayment = loanAmount > 0
    ? ((loanAmount - balloonAmount) * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -numberOfPayments))
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Car Finance Calculator</h1>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Price (R)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deposit (R)</label>
            <Input type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
            <input
              type="range"
              min={5}
              max={20}
              step={0.25}
              value={interest}
              onChange={(e) => setInterest(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">{interest.toFixed(2)}%</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Term (Months)</label>
            <select
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[36, 48, 60, 72].map((months) => (
                <option key={months} value={months}>{months} months</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Balloon/Residual Payment (%)</label>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={balloon}
              onChange={(e) => setBalloon(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">{balloon}% ({(balloonAmount).toLocaleString("en-ZA", { style: "currency", currency: "ZAR" })})</div>
          </div>

          <div className="text-xl font-semibold mt-6">
            Estimated Monthly Payment:
            <div className="text-green-600 text-2xl mt-1">
              R{monthlyPayment.toFixed(0).toLocaleString("en-ZA")}
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">Apply for Finance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
