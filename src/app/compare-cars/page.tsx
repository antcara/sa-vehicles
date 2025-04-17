"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import carData from "@/data/car-data.json";

export default function CompareCarsForm() {
  const router = useRouter();
  const [car1, setCar1] = useState("");
  const [car2, setCar2] = useState("");

  const uniqueVariants = Array.from(new Set(carData.map((car) => `${car.brand} ${car.model} ${car.variant}`)));

  const getSlug = (label) => {
    const match = carData.find((car) => `${car.brand} ${car.model} ${car.variant}` === label);
    return match ? `${match.variantSlug}` : null;
  };

  const handleCompare = () => {
    if (!car1 || !car2 || car1 === car2) return;
    const slug1 = getSlug(car1);
    const slug2 = getSlug(car2);
    if (slug1 && slug2) {
      router.push(`/compare/${slug1}-vs-${slug2}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Compare Cars</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Select First Car</label>
            <select value={car1} onChange={(e) => setCar1(e.target.value)} className="w-full p-2 border rounded">
              <option value="">-- Choose Car 1 --</option>
              {uniqueVariants.map((label, i) => (
                <option key={i} value={label}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Select Second Car</label>
            <select value={car2} onChange={(e) => setCar2(e.target.value)} className="w-full p-2 border rounded">
              <option value="">-- Choose Car 2 --</option>
              {uniqueVariants.map((label, i) => (
                <option key={i} value={label}>{label}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleCompare} disabled={!car1 || !car2 || car1 === car2} className="w-full">
            Compare
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
