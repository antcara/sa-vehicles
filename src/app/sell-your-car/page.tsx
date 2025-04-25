"use client";

import { useState } from "react";

const SellYourCarPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thanks! We'll be in touch.");
    // TODO: Save to DB or send via API
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Sell Your Car</h1>
      <p className="mb-6 text-gray-600">Fill in the details below and we’ll help you get offers from potential buyers.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Your Name" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
        <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

        <input name="brand" placeholder="Car Brand (e.g. Toyota)" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
        <input name="model" placeholder="Car Model (e.g. Corolla)" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
        <input name="year" type="number" placeholder="Year" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
        <input name="mileage" type="number" placeholder="Mileage (km)" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
        <input name="price" type="number" placeholder="Expected Price (R)" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

        <textarea name="notes" placeholder="Additional notes" rows={4} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

        <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Submit Your Listing
        </button>
      </form>
    </div>
  );
};

export default SellYourCarPage;
