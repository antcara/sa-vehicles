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

// --- Helper Functions ---
function parsePrice(value: string | number): number {
  if (typeof value === "string") {
    return parseInt(value.replace(/[^0-9]/g, "")) || 0;
  }
  return value;
}

function formatPrice(value: string | number): string {
  const numeric = parsePrice(value);
  return numeric.toLocaleString("en-ZA");
}

function calculateMonthlyPayment(price: number, deposit: number, interestRate: number, termMonths: number, balloonPercentage: number): number {
  const principal = price - deposit;
  const balloon = principal * (balloonPercentage / 100);
  const loanAmount = principal - balloon;
  const monthlyInterest = interestRate / 100 / 12;

  if (loanAmount <= 0) return 0;

  const monthlyPayment = loanAmount * (monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -termMonths)));
  return Math.round(monthlyPayment);
}
const HomePage = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [search, setSearch] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [bodyTypeFilters, setBodyTypeFilters] = useState<string[]>([]);
  const [transmissionFilters, setTransmissionFilters] = useState<string[]>([]);
  const [fuelTypeFilters, setFuelTypeFilters] = useState<string[]>([]);
  const [driveFilters, setDriveFilters] = useState<string[]>([]);
  const [seatFilters, setSeatFilters] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("");

  // Finance filters
  const [deposit, setDeposit] = useState(0);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(11);
  const [balloonPercentage, setBalloonPercentage] = useState(0);
  const [minMonthly, setMinMonthly] = useState(0);
  const [maxMonthly, setMaxMonthly] = useState(30000);

  // More Filters toggle
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const brands = [...new Set(carData.map(car => car.brand))].sort();
  const models = carData
    .filter(car => car.brand === selectedMake)
    .map(car => car.model)
    .filter((model, index, self) => self.indexOf(model) === index)
    .sort();

  if (!hasMounted) {
    return null;
  }
  const filteredCars = carData
    .filter((car) => {
      const keyword = search.toLowerCase();
      const numericPrice = parsePrice(car.price);
      const monthlyRepayment = calculateMonthlyPayment(numericPrice, deposit, interestRate, loanTermMonths, balloonPercentage);

      return (
        (keyword === "" || 
          car.brand.toLowerCase().includes(keyword) ||
          car.model.toLowerCase().includes(keyword) ||
          car.variant.toLowerCase().includes(keyword)
        ) &&
        (selectedMake === "" || car.brand === selectedMake) &&
        (selectedModel === "" || car.model === selectedModel) &&
        numericPrice >= minPrice &&
        numericPrice <= maxPrice &&
        monthlyRepayment >= minMonthly &&
        monthlyRepayment <= maxMonthly &&
        (bodyTypeFilters.length === 0 || bodyTypeFilters.includes(car.bodyType?.toLowerCase())) &&
        (transmissionFilters.length === 0 || transmissionFilters.includes(car.transmission?.toLowerCase())) &&
        (fuelTypeFilters.length === 0 || fuelTypeFilters.includes(car.fuelType?.toLowerCase())) &&
        (driveFilters.length === 0 || driveFilters.includes(car.drive?.toLowerCase())) &&
        (seatFilters.length === 0 || seatFilters.includes(parseInt(car.seats)))
      );
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return parsePrice(a.price) - parsePrice(b.price);
      } else if (sortBy === "name") {
        return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
      } else if (sortBy === "newest") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return 0;
    });

  const displayCars = search.trim() ? filteredCars.slice(0, 9) : filteredCars.slice(0, 9);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">South Africa's Simplest Car Price Guide</h1>
        <p className="text-gray-600 text-lg">Find up-to-date prices, compare models, and make smarter buying decisions.</p>
      </div>

      {/* Search */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <Input
          placeholder="Search by brand, model, or variant..."
          className="max-w-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Make and Model Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Make */}
        <div>
          <label className="block text-sm font-medium mb-1">Make (Brand)</label>
          <select
            value={selectedMake}
            onChange={(e) => {
              setSelectedMake(e.target.value);
              setSelectedModel(""); // reset model when brand changes
            }}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={!selectedMake}
          >
            <option value="">All Models</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Body Type</label>
          {['hatchback', 'suv', 'sedan', 'bakkie'].map((type) => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                value={type}
                onChange={(e) =>
                  setBodyTypeFilters((prev) =>
                    e.target.checked ? [...prev, type] : prev.filter((t) => t !== type)
                  )
                }
              /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium mb-1">Transmission</label>
          {['manual', 'automatic'].map((type) => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                value={type}
                onChange={(e) =>
                  setTransmissionFilters((prev) =>
                    e.target.checked ? [...prev, type] : prev.filter((t) => t !== type)
                  )
                }
              /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Fuel Type</label>
          {['petrol', 'diesel', 'hybrid', 'electric'].map((type) => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                value={type}
                onChange={(e) =>
                  setFuelTypeFilters((prev) =>
                    e.target.checked ? [...prev, type] : prev.filter((t) => t !== type)
                  )
                }
              /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        {/* Seats */}
        <div>
          <label className="block text-sm font-medium mb-1">Number of Seats</label>
          {[2, 4, 5, 6, 7].map((num) => (
            <label key={num} className="block text-sm">
              <input
                type="checkbox"
                value={num}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSeatFilters((prev) =>
                    e.target.checked ? [...prev, val] : prev.filter((t) => t !== val)
                  );
                }}
              /> {num} seats
            </label>
          ))}
        </div>

        {/* Drivetrain */}
        <div>
          <label className="block text-sm font-medium mb-1">Drivetrain</label>
          {['4x2', '4x4'].map((type) => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                value={type}
                onChange={(e) =>
                  setDriveFilters((prev) =>
                    e.target.checked ? [...prev, type] : prev.filter((t) => t !== type)
                  )
                }
              /> {type.toUpperCase()}
            </label>
          ))}
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Min Price"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value) || 1500000)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Max Price"
          />
        </div>
      </div>

      {/* Show More Filters Button */}
      <div className="text-center my-6">
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showMoreFilters ? "Hide More Filters" : "Show More Filters"}
        </button>
      </div>

      {/* Slide Down More Filters */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showMoreFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {showMoreFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Deposit */}
            <div>
              <label className="block text-sm font-medium mb-1">Deposit</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(parseInt(e.target.value) || 0)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Deposit"
              />
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium mb-1">Loan Term (months)</label>
              <select
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(parseInt(e.target.value))}
                className="w-full border px-3 py-2 rounded"
              >
                {[12, 24, 36, 48, 60, 72].map((term) => (
                  <option key={term} value={term}>
                    {term} months
                  </option>
                ))}
              </select>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
              <input
                type="range"
                min="5"
                max="20"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-sm mt-1">{interestRate}%</p>
            </div>

            {/* Balloon Payment */}
            <div>
              <label className="block text-sm font-medium mb-1">Balloon Payment (%)</label>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={balloonPercentage}
                onChange={(e) => setBalloonPercentage(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm mt-1">{balloonPercentage}%</p>
            </div>

            {/* Min Monthly Payment */}
            <div>
              <label className="block text-sm font-medium mb-1">Min Monthly Payment</label>
              <input
                type="number"
                value={minMonthly}
                onChange={(e) => setMinMonthly(parseInt(e.target.value) || 0)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Min Monthly"
              />
            </div>

            {/* Max Monthly Payment */}
            <div>
              <label className="block text-sm font-medium mb-1">Max Monthly Payment</label>
              <input
                type="number"
                value={maxMonthly}
                onChange={(e) => setMaxMonthly(parseInt(e.target.value) || 30000)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Max Monthly"
              />
            </div>
          </div>
        )}
      </div>

      {/* Car Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {displayCars.map((car, idx) => {
          const numericPrice = parsePrice(car.price);
          const monthlyRepayment = calculateMonthlyPayment(numericPrice, deposit, interestRate, loanTermMonths, balloonPercentage);

          return (
            <Link key={idx} href={`/cars/${car.brand}/${car.model}/${car.variantSlug}`}>
              <Card className="hover:shadow-lg transition rounded-2xl">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{car.brand} {car.model}</h3>
                  <p className="text-sm text-gray-500">{car.variant}</p>
                  <p className="text-sm text-gray-500">{car.vehicleType !== "Unknown" ? car.vehicleType : "To Be Classified"}</p>
                  <p className="text-sm mt-1">R{formatPrice(car.price)}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Est. Monthly: R{monthlyRepayment.toLocaleString("en-ZA")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
