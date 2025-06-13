"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

function UpgradePage() {
  const handleUpgrade = (plan) => {
    if (plan === "basic") {
      window.location.href = "https://rzp.io/rzp/X3hKhIg";
    } else if (plan === "premium") {
      window.location.href = "https://rzp.io/rzp/bYpoKOi";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-extrabold text-center text-primary mb-6">
        Choose Your Plan
      </h1>
      <p className="text-gray-700 text-lg text-center mb-12">
        Upgrade to Premium and unlock exclusive features. Choose the plan that
        suits you the best!
      </p>
      <div className="flex gap-8 justify-center">
        <div className="bg-white shadow-lg rounded-xl w-80 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ₹99 - Basic Plan
          </h2>
          <p className="text-3xl font-bold text-gray-800 mb-6">₹99</p>
          <ul className="text-gray-600 space-y-4 mb-6">
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> 999 credit points
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> Export in HD quality
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> Priority support
            </li>
          </ul>
          <Button
            onClick={() => handleUpgrade("basic")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
          >
            Upgrade Now
          </Button>
        </div>

        <div className="bg-white shadow-lg rounded-xl w-80 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ₹499 - Premium Plan
          </h2>
          <p className="text-3xl font-bold text-gray-800 mb-6">₹499</p>
          <ul className="text-gray-600 space-y-4 mb-6">
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> 99999 credit points
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> Export in 4K quality
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> Priority support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> Access to upcoming AI
              features
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" /> Exclusive content
            </li>
          </ul>
          <Button
            onClick={() => handleUpgrade("premium")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UpgradePage;
