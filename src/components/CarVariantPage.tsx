import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CarVariantPage({ data }: { data: any }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {data.brand} {data.model} {data.variant} - {data.year} Price in South Africa
      </h1>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={data.imageUrl}
            alt={`${data.model} ${data.variant}`}
            className="rounded-xl w-full h-auto object-cover"
          />

          <div>
            <p className="text-xl font-semibold mb-2">Price: {data.price}</p>
            <ul className="space-y-1">
              <li>Fuel Type: {data.fuelType}</li>
              <li>Transmission: {data.transmission}</li>
              <li>Body Type: {data.bodyType}</li>
              <li>Year: {data.year}</li>
            </ul>

            <div className="mt-6">
              <Button className="w-full">Request a Quote</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
