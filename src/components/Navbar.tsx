"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-black">
          SA Vehicles
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-gray-600"
        >
          {isOpen ? <X /> : <Menu />}
        </button>

        <div className={`flex-col sm:flex sm:flex-row sm:items-center sm:gap-6 ${isOpen ? "flex" : "hidden"}`}>
          <Link href="/best-cars-under-r300k" className="py-2 sm:py-0 text-sm text-gray-700 hover:text-black">
            Under R300k
          </Link>
          <Link href="/fuel-efficient-hatchbacks" className="py-2 sm:py-0 text-sm text-gray-700 hover:text-black">
            Fuel Efficient
          </Link>
          <Link href="/compare/polo-vs-i20" className="py-2 sm:py-0 text-sm text-gray-700 hover:text-black">
            Compare
          </Link>
          <Link href="/top-suvs" className="py-2 sm:py-0 text-sm text-gray-700 hover:text-black">
            Top SUVs
          </Link>
          <Link href="/tools/finance-calculator" className="py-2 sm:py-0 text-sm text-gray-700 hover:text-black">
            Finance Calculator
          </Link>
          <Link href="/sell-your-car" className="py-2 sm:py-0 text-sm text-gray-700 hover:text-black">
            Sell Your Car
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
