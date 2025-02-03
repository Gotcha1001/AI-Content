"use client";

import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";

function BuyCredits() {
  const creditsOption = [
    {
      credits: 10, // 10,000 words
      amount: 29.99,
    },
    {
      credits: 25, // 25,000 words
      amount: 44.99,
    },
    {
      credits: 50, // 50,000 words
      amount: 89.99,
    },
    {
      credits: 100, // 100,000 words
      amount: 149.99,
    },
  ];

  const [selectedOption, setSelectedOption] = useState<{
    credits: number;
    amount: number;
  } | null>(null);
  const { userDetail } = useContext(TotalUsageContext);
  const router = useRouter();

  const initiatePayment = async () => {
    if (!selectedOption) {
      toast.error("Please select a credit package");
      return;
    }

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedOption.amount,
          credits: selectedOption.credits,
          userEmail: userDetail.email,
          itemName: `${selectedOption.credits} AI Design Credits`,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to initiate payment");
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      toast.error("Error initiating payment");
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <h2 className="font-bold text-4xl gradient-title text-center">
        Buy More Credits
      </h2>
      <p className="text-white text-center mt-5">
        Unlock Endless Possibilities: 10 Credits = 10,000 Words. Buy More
        Credits And Transform Your Life Today With Fantastic Inspirational AI
        Ideas
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5 mt-10">
        {creditsOption.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex flex-col gap-2 justify-center items-center ${
                selectedOption?.credits === item.credits
                  ? "border-indigo-600 p-1"
                  : ""
              }`}
            >
              <h2 className="font-bold text-3xl text-yellow-500">
                {item.credits}
              </h2>
              <h2 className="font-medium text-xl text-white">Credits</h2>
              <Button
                className="w-full"
                onClick={() => setSelectedOption(item)}
              >
                Select
              </Button>
              <h2 className="font-bold text-yellow-500 mb-4">R{item.amount}</h2>
            </div>
          );
        })}
      </div>

      <div className="mt-20 flex justify-center">
        {selectedOption?.amount && (
          <Button
            className="w-full md:w-1/2 lg:w-1/3 p-6 bg-green-600 hover:bg-green-700 text-white font-bold"
            onClick={initiatePayment}
          >
            Pay with PayFast
          </Button>
        )}
      </div>

      {/* Before and After Images Section */}
      <div className="mt-10 flex flex-col items-center space-y-6 md:flex-row md:space-x-6 md:space-y-0 md:justify-center mb-10"></div>
    </div>
  );
}

export default BuyCredits;
