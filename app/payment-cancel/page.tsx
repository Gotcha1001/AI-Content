"use client";
import React from "react";
import Head from "next/head";
import Link from "next/link";

const PaymentCancelPage = () => {
  return (
    <>
      <Head>
        <title>Payment Cancelled</title>
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen gradient-background10">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Payment Cancelled
          </h2>
          <p className="text-lg text-gray-700 text-center mb-8">
            Your payment was cancelled.
          </p>
          <div className="text-center">
            <Link href="/cart"></Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentCancelPage;
