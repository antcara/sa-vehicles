"use client";

import { useParams } from "next/navigation";
import carData from "@/data/car-data.json";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

export default function BrandPage() {
  const params = useParams();
  const brand = params?.brand?.toLowerCase();
  const [sortBy, setSortBy] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [bodyType, setBodyType] = useState("");

  let filteredCars = carData.filter((car) => {
    const matchesBrand = car.brand.toLowerCase() === brand;
    const matchesFuel = !fuelType || (car.fuelType?.toLowerCase() === fuelType);
    const matchesTrans = !transmission || (car.transmission?.toLowerCase() === transmission);
    const matchesBody = !bodyType || (car.bodyType?.toLowerCase() === bodyType);
    return matchesBrand && matchesFuel && matchesTrans && matchesBody;
  });

  if (sortBy === "price") {
    filteredCars.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, "")));
  } else if (sortBy === "name") {
    filteredCars.sort((a, b) => a.model.localeCompare(b.model));
  }

  const groupedByModel = filteredCars.reduce((acc, car) => {
    if (!acc[car.model]) acc[car.model] = [];
    acc[car.model].push(car);
    return acc;
  }, {});

  const [openModels, setOpenModels] = useState({});

  const toggleModel = (model) => {
    setOpenModels((prev) => ({ ...prev, [model]: !prev[model] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold capitalize">{brand} Vehicles</h1>
        <div className="flex flex-wrap gap-3">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="">Sort by</option>
            <option value="price">Lowest Price</option>
            <option value="name">Model Name (A-Z)</option>
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

      {Object.keys(groupedByModel).length > 0 ? (
        Object.keys(groupedByModel).sort().map((model) => (
          <div key={model} className="border rounded mb-4">
            <button
              onClick={() => toggleModel(model)}
              className="w-full text-left p-4 bg-gray-100 font-semibold text-lg hover:bg-gray-200"
            >
              {model} ({groupedByModel[model].length} variants)
            </button>
            {openModels[model] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {groupedByModel[model].map((car, idx) => (
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
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No vehicles found for this brand.</p>
      )}
    </div>
  );
}
