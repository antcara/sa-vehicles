"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import carData from "@/data/car-data.json";

const popularPages = [
  { title: "Best Cars Under R300k", href: "/best-cars-under-r300k" },
  { title: "Most Fuel Efficient Hatchbacks", href: "/fuel-efficient-hatchbacks" },
  { title: "Compare Polo vs i20", href: "/compare/polo-vs-i20" },
  { title: "Top SUVs in South Africa", href: "/top-suvs" },
  { title: "Car Finance Calculator", href: "/tools/finance-calculator" },
];

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [fuelType, setFuelType] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredCars = carData
    .filter((car) => {
      const keyword = search.toLowerCase();
      const numericPrice = parseInt(car.price.replace(/[^0-9]/g, "")) || 0;
      return (
        (car.brand.toLowerCase().includes(keyword) ||
          car.model.toLowerCase().includes(keyword) ||
          car.variant.toLowerCase().includes(keyword)) &&
        numericPrice <= maxPrice &&
        (!fuelType || (car.fuelType && car.fuelType.toLowerCase() === fuelType)) &&
        (!bodyType || (car.bodyType && car.bodyType.toLowerCase() === bodyType)) &&
        (!transmission || (car.transmission && car.transmission.toLowerCase() === transmission))
      );
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, ""));
      } else if (sortBy === "name") {
        return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
      } else if (sortBy === "newest") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return 0;
    });

  const grouped = {};
  carData.forEach((car) => {
    const body = car.bodyType?.toLowerCase();
    const price = parseInt(car.price.replace(/[^0-9]/g, "")) || 9999999;
    if (!grouped[body]) grouped[body] = [];
    grouped[body].push({ ...car, numericPrice: price });
  });

  const defaultSelection = Object.values(grouped)
    .flatMap((cars) => cars.sort((a, b) => a.numericPrice - b.numericPrice).slice(0, 2))
    .sort((a, b) => a.numericPrice - b.numericPrice)
    .slice(0, 9);

  const displayCars = search.trim() ? filteredCars.slice(0, 9) : defaultSelection;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">South Africa's Simplest Car Price Guide</h1>
        <p className="text-gray-600 text-lg">Find up-to-date prices, compare models, and make smarter buying decisions.</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Input
          placeholder="Search by brand, model, or variant..."
          className="max-w-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayCars.map((car, idx) => (
          <Link key={idx} href={`/cars/${car.brand}/${car.model}/${car.variantSlug}`}>
            <Card className="hover:shadow-lg transition rounded-2xl">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{car.brand} {car.model}</h3>
                <p className="text-sm text-gray-500">{car.variant}</p>
                <p className="text-sm mt-1">{car.price}</p>
                {hasMounted && car.price && !isNaN(parseInt(car.price.replace(/[^0-9]/g, ""))) && (
                  <p className="text-xs text-green-600 mt-1">
                    Est. Monthly: R{Math.round((parseInt(car.price.replace(/[^0-9]/g, "")) * 0.021)).toLocaleString("en-ZA")}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Popular Tools & Comparisons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {popularPages.map((page) => (
            <Link key={page.href} href={page.href}>
              <Card className="hover:shadow-lg transition rounded-2xl">
                <CardContent className="p-4 text-center">
                  <p className="text-md font-medium">{page.title}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
