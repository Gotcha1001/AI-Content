"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TotalUsageContext } from "./(context)/TotalUsageContext";
import { UpdateCreditUsageContext } from "./(context)/UpdateCreditUsageContext";

function Provider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null);
  const [totalUsage, setTotalUsage] = useState<number>(0);
  const [updateCreditUsage, setUpdateCreditUsage] = useState<any>();

  useEffect(() => {
    if (user) {
      VerifyUser();
    }
  }, [user]);

  const VerifyUser = async () => {
    try {
      const response = await axios.post("/api/verify-user", { user });
      setUserDetail(response.data.result);
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  return (
    <TotalUsageContext.Provider
      value={{
        userDetail,
        setUserDetail,
        totalUsage,
        setTotalUsage,
      }}
    >
      <UpdateCreditUsageContext.Provider
        value={{ updateCreditUsage, setUpdateCreditUsage }}
      >
        {children}
      </UpdateCreditUsageContext.Provider>
    </TotalUsageContext.Provider>
  );
}

export default Provider;
