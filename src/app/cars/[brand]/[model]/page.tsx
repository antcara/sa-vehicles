"use client";

import { useParams } from "next/navigation";
import carData from "@/data/car-data.json";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

export default function ModelVariantsPage() {
  const params = useParams();
  const brand = params?.brand?.toLowerCase();
  const model = params?.model?.toLowerCase();
  const [sortBy, setSortBy] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [bodyType, setBodyType] = useState("");

  let modelCars = carData.filter(
    (car) =>
      car.brand.toLowerCase() === brand &&
      car.model.toLowerCase() === model &&
      (!fuelType || (car.fuelType?.toLowerCase() === fuelType)) &&
      (!transmission || (car.transmission?.toLowerCase() === transmission)) &&
      (!bodyType || (car.bodyType?.toLowerCase() === bodyType))
  );

  if (sortBy === "price") {
    modelCars.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, "")));
  } else if (sortBy === "name") {
    modelCars.sort((a, b) => a.variant.localeCompare(b.variant));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold capitalize">{brand} {model} Variants</h1>
        <div className="flex flex-wrap gap-3">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="">Sort by</option>
            <option value="price">Lowest Price</option>
            <option value="name">Variant Name (A-Z)</option>
          </select>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="border p-2 rounded">
            <option value="">Fuel</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
          <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="border p-2 rounded">
            <option value="">Transmission</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
            <option value="cvt">CVT</option>
          </select>
          <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="border p-2 rounded">
            <option value="">Body</option>
            <option value="hatchback">Hatchback</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="bakkie">Bakkie</option>
            <option value="van">Van</option>
          </select>
        </div>
      </div>

      {modelCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {modelCars.map((car, idx) => (
            <Link key={idx} href={`/cars/${car.brand}/${car.model}/${car.variantSlug}`}>
              <Card className="hover:shadow-md transition h-full">
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-base font-semibold">{car.variant}</h3>
                  <p className="text-sm text-gray-500">{car.price}</p>
                  <p className="text-sm text-gray-400">{car.transmission} • {car.fuelType}</p>
                  {car.price && !isNaN(parseInt(car.price.replace(/[^0-9]/g, ""))) && (
                    <p className="text-xs text-green-600">
                      Est. Monthly: R{Math.round((parseInt(car.price.replace(/[^0-9]/g, "")) * 0.021)).toLocaleString("en-ZA")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No variants found for this model.</p>
      )}
    </div>
  );
}
