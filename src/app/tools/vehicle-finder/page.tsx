"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import carData from "@/data/car-data.json";

export default function VehicleQuiz() {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState(300000);
  const [boot, setBoot] = useState("");
  const [transmission, setTransmission] = useState("");
  const [seats, setSeats] = useState(0);
  const [fuelType, setFuelType] = useState("");
  const [bodyType, setBodyType] = useState("");

  const next = () => setStep((prev) => prev + 1);
  const restart = () => {
    setStep(0);
    setBoot("");
    setTransmission("");
    setSeats(0);
    setFuelType("");
    setBodyType("");
  };

  const results = carData.filter((car) => {
    const price = parseInt(car.price.replace(/[^0-9]/g, "")) || 0;
    const seatCount = parseInt(car.seats) || 0;
    return (
      price <= budget &&
      (!boot || (boot === "yes" ? car.bodyType?.toLowerCase().includes("suv") || car.bodyType?.toLowerCase().includes("hatch") : true)) &&
      (!transmission || car.transmission?.toLowerCase() === transmission) &&
      (!seats || seatCount >= seats) &&
      (!fuelType || car.fuelType?.toLowerCase() === fuelType) &&
      (!bodyType || car.bodyType?.toLowerCase() === bodyType)
    );
  }).slice(0, 6);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center">Find the Right Vehicle</h1>

      {step === 0 && (
        <Card><CardContent className="p-6 space-y-4">
          <p className="font-medium">What's your monthly budget?</p>
          <input type="range" min={100000} max={1000000} step={10000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-gray-600">Up to R{budget.toLocaleString("en-ZA")}</div>
          <Button className="mt-4" onClick={next}>Next</Button>
        </CardContent></Card>
      )}

      {step === 1 && (
        <Card><CardContent className="p-6 space-y-4">
          <p className="font-medium">Do you need boot space?</p>
          <div className="flex gap-4">
            <Button variant={boot === "yes" ? "default" : "outline"} onClick={() => { setBoot("yes"); next(); }}>Yes</Button>
            <Button variant={boot === "no" ? "default" : "outline"} onClick={() => { setBoot("no"); next(); }}>No</Button>
          </div>
        </CardContent></Card>
      )}

      {step === 2 && (
        <Card><CardContent className="p-6 space-y-4">
          <p className="font-medium">Preferred transmission?</p>
          <div className="flex gap-4">
            <Button variant={transmission === "automatic" ? "default" : "outline"} onClick={() => { setTransmission("automatic"); next(); }}>Automatic</Button>
            <Button variant={transmission === "manual" ? "default" : "outline"} onClick={() => { setTransmission("manual"); next(); }}>Manual</Button>
          </div>
        </CardContent></Card>
      )}

      {step === 3 && (
        <Card><CardContent className="p-6 space-y-4">
          <p className="font-medium">How many seats do you need?</p>
          <div className="flex gap-2 flex-wrap">
            {[2, 4, 5, 7, 8].map((count) => (
              <Button key={count} variant={seats === count ? "default" : "outline"} onClick={() => { setSeats(count); next(); }}>{count}+</Button>
            ))}
          </div>
        </CardContent></Card>
      )}

      {step === 4 && (
        <Card><CardContent className="p-6 space-y-4">
          <p className="font-medium">Preferred fuel type?</p>
          <div className="flex gap-2 flex-wrap">
            {["petrol", "diesel", "hybrid", "electric"].map((type) => (
              <Button key={type} variant={fuelType === type ? "default" : "outline"} onClick={() => { setFuelType(type); next(); }}>{type.charAt(0).toUpperCase() + type.slice(1)}</Button>
            ))}
          </div>
        </CardContent></Card>
      )}

      {step === 5 && (
        <Card><CardContent className="p-6 space-y-4">
          <p className="font-medium">Preferred body type?</p>
          <div className="flex gap-2 flex-wrap">
            {["hatchback", "sedan", "suv", "bakkie", "van"].map((type) => (
              <Button key={type} variant={bodyType === type ? "default" : "outline"} onClick={() => { setBodyType(type); next(); }}>{type.charAt(0).toUpperCase() + type.slice(1)}</Button>
            ))}
          </div>
        </CardContent></Card>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Results:</h2>
          {results.length > 0 ? (
            results.map((car, idx) => (
              <Link key={idx} href={`/cars/${car.brand}/${car.model}/${car.variantSlug}`}>
                <Card className="hover:shadow-md transition">
                  <CardContent className="p-4">
                    <div className="font-medium">{car.brand} {car.model} - {car.variant}</div>
                    <div className="text-sm text-gray-500">{car.price}</div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No matches found. Try adjusting your answers.</p>
          )}
          <Button variant="outline" onClick={restart}>Start Over</Button>
        </div>
      )}
    </div>
  );
}
