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

// Helpers
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

  // Search + Make + Model
  const [search, setSearch] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // Vehicle filters
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

  const resetFilters = () => {
    setSearch("");
    setSelectedMake("");
    setSelectedModel("");
    setMinPrice(0);
    setMaxPrice(1500000);
    setDeposit(0);
    setLoanTermMonths(60);
    setInterestRate(11);
    setBalloonPercentage(0);
    setMinMonthly(0);
    setMaxMonthly(30000);
    setBodyTypeFilters([]);
    setTransmissionFilters([]);
    setFuelTypeFilters([]);
    setDriveFilters([]);
    setSeatFilters([]);
    setShowMoreFilters(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveFilter = (filter) => {
    switch (filter.type) {
      case "make":
        setSelectedMake("");
        setSelectedModel("");
        break;
      case "model":
        setSelectedModel("");
        break;
      case "bodyType":
        setBodyTypeFilters(prev => prev.filter((t) => t !== filter.label.toLowerCase()));
        break;
      case "transmission":
        setTransmissionFilters(prev => prev.filter((t) => t !== filter.label.toLowerCase()));
        break;
      case "fuelType":
        setFuelTypeFilters(prev => prev.filter((t) => t !== filter.label.toLowerCase()));
        break;
      case "drive":
        setDriveFilters(prev => prev.filter((t) => t !== filter.label.toLowerCase()));
        break;
      case "seats":
        setSeatFilters(prev => prev.filter((n) => n !== filter.value));
        break;
      case "minPrice":
        setMinPrice(0);
        break;
      case "maxPrice":
        setMaxPrice(1500000);
        break;
      case "monthly":
        setMinMonthly(0);
        setMaxMonthly(30000);
        break;
      case "deposit":
        setDeposit(0);
        break;
      case "balloon":
        setBalloonPercentage(0);
        break;
      default:
        break;
    }
  };

  const activeFilters = [];
  if (selectedMake) activeFilters.push({ label: selectedMake, type: "make" });
  if (selectedModel) activeFilters.push({ label: selectedModel, type: "model" });
  if (bodyTypeFilters.length > 0) activeFilters.push(...bodyTypeFilters.map(type => ({ label: type.charAt(0).toUpperCase() + type.slice(1), type: "bodyType" })));
  if (transmissionFilters.length > 0) activeFilters.push(...transmissionFilters.map(type => ({ label: type.charAt(0).toUpperCase() + type.slice(1), type: "transmission" })));
  if (fuelTypeFilters.length > 0) activeFilters.push(...fuelTypeFilters.map(type => ({ label: type.charAt(0).toUpperCase() + type.slice(1), type: "fuelType" })));
  if (driveFilters.length > 0) activeFilters.push(...driveFilters.map(type => ({ label: type.toUpperCase(), type: "drive" })));
  if (seatFilters.length > 0) activeFilters.push(...seatFilters.map(num => ({ label: `${num} seats`, type: "seats", value: num })));
  if (minPrice > 0) activeFilters.push({ label: `Min R${minPrice.toLocaleString("en-ZA")}`, type: "minPrice" });
  if (maxPrice < 1500000) activeFilters.push({ label: `Max R${maxPrice.toLocaleString("en-ZA")}`, type: "maxPrice" });
  if (minMonthly > 0 || maxMonthly < 30000) activeFilters.push({ label: `Monthly R${minMonthly} - R${maxMonthly}`, type: "monthly" });
  if (deposit > 0) activeFilters.push({ label: `Deposit R${deposit.toLocaleString("en-ZA")}`, type: "deposit" });
  if (balloonPercentage > 0) activeFilters.push({ label: `Balloon ${balloonPercentage}%`, type: "balloon" });

  const filteredCars = carData
    .filter((car) => {
      const keyword = search.toLowerCase();
      const numericPrice = parsePrice(car.price);
      const monthlyRepayment = calculateMonthlyPayment(numericPrice, deposit, interestRate, loanTermMonths, balloonPercentage);

      return (
        (keyword === "" ||
          car.brand.toLowerCase().includes(keyword) ||
          car.model.toLowerCase().includes(keyword) ||
          car.variant.toLowerCase().includes(keyword)) &&
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

      {/* Make and Model Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Make */}
        <div>
          <label className="block text-sm font-medium mb-1">Make (Brand)</label>
          <select
            value={selectedMake}
            onChange={(e) => {
              setSelectedMake(e.target.value);
              setSelectedModel(""); // reset model if brand changes
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

        {/* Reset Filters Button */}
        <div className="text-center my-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filters Summary Bar */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 bg-gray-100 p-4 rounded mb-6">
          {activeFilters.map((filter, index) => (
            <div key={index} className="flex items-center bg-white border px-3 py-1 rounded-full text-sm">
              {filter.label}
              <button
                onClick={() => handleRemoveFilter(filter)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filters Section */}
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
          <label className="block text-sm font-medium mb-1">Seats</label>
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
      </div>

      {/* More Filters Toggle */}
      <div className="text-center my-6">
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showMoreFilters ? "Hide More Filters" : "Show More Filters"}
        </button>
      </div>

      {/* More Filters Section */}
      <div className={`overflow-hidden transition-all duration-500 ${showMoreFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
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
              />
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium mb-1">Loan Term</label>
              <select
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(parseInt(e.target.value))}
                className="w-full border px-3 py-2 rounded"
              >
                {[12, 24, 36, 48, 60, 72].map((term) => (
                  <option key={term} value={term}>{term} months</option>
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
              <label className="block text-sm font-medium mb-1">Balloon (%)</label>
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
      <section className="mt-12">
  <h2 className="text-2xl font-semibold mb-4">Explore More</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    
    {/* Compare Vehicles */}
    <Link href="/compare">
      <Card className="hover:shadow-lg transition rounded-2xl">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-semibold">Compare Vehicles</p>
        </CardContent>
      </Card>
    </Link>

    {/* Car Finance Calculator */}
    <Link href="/tools/finance-calculator">
      <Card className="hover:shadow-lg transition rounded-2xl">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-semibold">Car Finance Calculator</p>
        </CardContent>
      </Card>
    </Link>

    {/* Sell Your Car */}
    <Link href="/sell-your-car">
      <Card className="hover:shadow-lg transition rounded-2xl">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-semibold">Sell Your Car</p>
        </CardContent>
      </Card>
    </Link>

  </div>
</section>

    </div>
  );
};

export default HomePage;
