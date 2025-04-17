import CarVariantPage from "@/components/CarVariantPage";

interface Props {
  params: {
    brand: string;
    model: string;
    variant: string;
  };
}

export default async function Page({ params }: Props) {
  // Example: fetch data from your script's output (file, API, DB, etc.)
  const carData = await getCarData(params.brand, params.model, params.variant);

  if (!carData) {
    return <div>Car variant not found</div>;
  }

  return <CarVariantPage data={carData} />;
}

// Mock fetch function (replace with real logic)
async function getCarData(brand: string, model: string, variant: string) {
  const allCarsModule = await import("@/data/car-data.json");
  const allCars = allCarsModule.default;

  return allCars.find(
    (car) =>
      car.brand.toLowerCase() === brand &&
      car.model.toLowerCase() === model &&
      car.variantSlug.toLowerCase() === variant
  );
}
