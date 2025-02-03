import { db } from "@/app/utils/db";
import { AIOutput } from "@/app/utils/schema";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import { HistoryItem } from "../history/page";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { useRouter } from "next/navigation";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

// Define the DBRecord type
type DBRecord = {
  id: number;
  formData: string;
  aiResponse: string | null;
  templateSlug: string;
  createdBy: string;
  createdAt: string | null;
};

function UsageTrack() {
  const { user } = useUser();
  //   const [totalUsage, setTotalUsage] = useState<number>(0);
  const { totalUsage, setTotalUsage, userDetail } =
    useContext(TotalUsageContext);

  const { updateCreditUsage, setUpdateCreditUsage } = useContext(
    UpdateCreditUsageContext
  );

  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetData();
    }
  }, [user]);

  useEffect(() => {
    user && GetData();
  }, [updateCreditUsage && user]);

  const GetData = async () => {
    const result: DBRecord[] = await db
      .select()
      .from(AIOutput)
      .where(
        eq(AIOutput.createdBy, user?.primaryEmailAddress?.emailAddress || "")
      );

    // Call GetTotalUsage to count the words in aiResponse
    GetTotalUsage(result);
  };

  const GetTotalUsage = (result: DBRecord[]) => {
    let total: number = 0;

    result.forEach((element) => {
      if (element.aiResponse) {
        // Calculate word count
        const wordCount = element.aiResponse
          .split(/\s+/)
          .filter(Boolean).length;
        total += wordCount; // Add word count to total usage
      }
    });

    setTotalUsage(total);
    console.log("Total usage (word count):", total);
  };

  // Ensure totalUsage doesn't exceed 10,000
  const progressPercentage = Math.min(
    (totalUsage / (userDetail?.credits * 1000)) * 100,
    100
  );

  return (
    <div className="m-5">
      <div className="bg-primary text-white rounded-lg p-3">
        <h2 className="font-medium">Credits</h2>
        <div className="h-2 bg-[#9981f9] w-full rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            style={{
              width: `${progressPercentage}%`,
            }}
          ></div>
        </div>
        <h2 className="text-sm my-2">
          {totalUsage}/{userDetail?.credits * 1000} Words Used
        </h2>
        <span className="text-xs ml-2 text-yellow-300">
          10 credits = 10,000 words
        </span>
      </div>
      <Button
        variant="sex1"
        className="w-full my-3"
        onClick={() => router.push("/dashboard/billing")}
      >
        Upgrade
      </Button>
    </div>
  );
}
export default UsageTrack;
