"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import carData from "@/data/car-data.json";

export default function CompareSlugPage() {
  const params = useParams();
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);

  useEffect(() => {
    if (!params?.slug) return;
    const [slug1, slug2] = params.slug.split("-vs-");
    const match1 = carData.find((c) => c.variantSlug === slug1);
    const match2 = carData.find((c) => c.variantSlug === slug2);
    setCar1(match1 || null);
    setCar2(match2 || null);
  }, [params]);

  const features = [
    "brand", "model", "variant", "price", "fuelType", "transmission",
    "bodyType", "year", "vehicleType"
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Vehicle Comparison</h1>
      <Card>
        <CardContent className="overflow-x-auto p-6">
          {car1 && car2 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-medium p-2">Feature</th>
                  <th className="text-left font-semibold p-2">{car1.brand} {car1.model}</th>
                  <th className="text-left font-semibold p-2">{car2.brand} {car2.model}</th>
                </tr>
              </thead>
              <tbody>
                {features.map((key) => (
                  <tr key={key} className="border-t">
                    <td className="p-2 font-medium text-gray-700">{key}</td>
                    <td className="p-2 text-gray-800">{car1[key]}</td>
                    <td className="p-2 text-gray-800">{car2[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">One or both cars could not be loaded.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
