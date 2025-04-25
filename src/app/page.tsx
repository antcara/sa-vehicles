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
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [bodyTypeFilters, setBodyTypeFilters] = useState<string[]>([]);
  const [transmissionFilters, setTransmissionFilters] = useState<string[]>([]);
  const [fuelTypeFilters, setFuelTypeFilters] = useState<string[]>([]);
  const [driveFilters, setDriveFilters] = useState<string[]>([]);
  const [seatFilters, setSeatFilters] = useState<number[]>([]);
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
        numericPrice >= minPrice &&
        numericPrice <= maxPrice &&
        (bodyTypeFilters.length === 0 || bodyTypeFilters.includes(car.bodyType?.toLowerCase())) &&
        (transmissionFilters.length === 0 || transmissionFilters.includes(car.transmission?.toLowerCase())) &&
        (fuelTypeFilters.length === 0 || fuelTypeFilters.includes(car.fuelType?.toLowerCase())) &&
        (driveFilters.length === 0 || driveFilters.includes(car.drive?.toLowerCase())) &&
        (seatFilters.length === 0 || seatFilters.includes(parseInt(car.seats)))
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

  const fallbackSelection = carData
    .map(car => ({
      ...car,
      numericPrice: parseInt(car.price.replace(/[^0-9]/g, "")) || 9999999
    }))
    .sort((a, b) => a.numericPrice - b.numericPrice)
    .slice(0, 9);

  const displayCars = search.trim()
    ? filteredCars.slice(0, 9)
    : (defaultSelection.length >= 6 ? defaultSelection : fallbackSelection);

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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full max-w-6xl mx-auto">
        {/* Monthly repayment slider */}
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Repayment (max)</label>
          <input
            type="range"
            min="1000"
            max="30000"
            step="500"
            value={maxPrice * 0.021}
            onChange={(e) => setMaxPrice(Math.round(parseInt(e.target.value) / 0.021))}
            className="w-full"
          />
          <p className="text-sm mt-1">Up to R{Math.round(maxPrice * 0.021).toLocaleString("en-ZA")}/month</p>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <select
            onChange={(e) => setMinPrice(parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          >
            {[0, 50000, 100000, 150000, 200000].map((val) => (
              <option key={val} value={val}>R{val.toLocaleString("en-ZA")}</option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <select
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          >
            {[200000, 300000, 400000, 600000, 1000000, 1500000].map((val) => (
              <option key={val} value={val}>R{val.toLocaleString("en-ZA")}</option>
            ))}
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Body Type</label>
          {['hatchback', 'suv', 'sedan', 'bakkie'].map(type => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                value={type}
                onChange={(e) => {
                  setBodyTypeFilters(prev =>
                    e.target.checked ? [...prev, type] : prev.filter(t => t !== type)
                  );
                }}
              /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium mb-1">Transmission</label>
          {['manual', 'automatic'].map(type => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                value={type}
                onChange={(e) => {
                  setTransmissionFilters(prev =>
                    e.target.checked ? [...prev, type] : prev.filter(t => t !== type)
                  );
                }}
              /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Fuel Type</label>
          {['petrol', 'diesel', 'hybrid', 'electric'].map(type => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                value={type}
                onChange={(e) => {
                  setFuelTypeFilters(prev =>
                    e.target.checked ? [...prev, type] : prev.filter(t => t !== type)
                  );
                }}
              /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        {/* Drivetrain */}
        <div>
          <label className="block text-sm font-medium mb-1">Drivetrain</label>
          {['4x2', '4x4'].map(type => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                value={type}
                onChange={(e) => {
                  setDriveFilters(prev =>
                    e.target.checked ? [...prev, type] : prev.filter(t => t !== type)
                  );
                }}
              /> {type.toUpperCase()}
            </label>
          ))}
        </div>

        {/* Number of Seats */}
        <div>
          <label className="block text-sm font-medium mb-1">Number of Seats</label>
          {[2, 4, 5, 6, 7].map(num => (
            <label key={num} className="block text-sm">
              <input
                type="checkbox"
                value={num}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSeatFilters(prev =>
                    e.target.checked ? [...prev, val] : prev.filter(t => t !== val)
                  );
                }}
              /> {num} seats
            </label>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayCars.map((car, idx) => (
          <Link key={idx} href={`/cars/${car.brand}/${car.model}/${car.variantSlug}`}>
            <Card className="hover:shadow-lg transition rounded-2xl">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{car.brand} {car.model}</h3>
                <p className="text-sm text-gray-500">{car.variant}</p>
                <p className="text-sm text-gray-500">
                  {car.vehicleType !== "Unknown" ? car.vehicleType : "To Be Classified"}
                </p>
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
