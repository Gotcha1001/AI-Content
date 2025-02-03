"use client";
import React, { useState, useEffect, useContext } from "react";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Templates from "@/app/(data)/Templates";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { chatSession } from "@/app/utils/AiModel";
import { db } from "@/app/utils/db";
import { AIOutput } from "@/app/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { eq } from "drizzle-orm";
import { useRouter, useSearchParams } from "next/navigation";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { toast } from "sonner";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

interface PROPS {
  params: {
    "template-slug": string;
  };
}

function CreateNewContent(props: PROPS) {
  const searchParams = useSearchParams();
  const historyId = searchParams.get("id");

  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug == props.params["template-slug"]
  );

  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const [initialFormData, setInitialFormData] = useState<any>(null);

  const router = useRouter();

  const { user } = useUser();

  const { totalUsage, setTotalUsage, userDetail } =
    useContext(TotalUsageContext);

  const { updateCreditUsage, setUpdateCreditUsage } = useContext(
    UpdateCreditUsageContext
  );

  // Fetch existing data if historyId is present
  useEffect(() => {
    const fetchHistoryData = async () => {
      if (historyId) {
        try {
          const result = await db
            .select()
            .from(AIOutput)
            .where(eq(AIOutput.id, parseInt(historyId)));

          if (result && result[0]) {
            // Parse the stored formData string back to an object
            const parsedFormData = JSON.parse(result[0].formData);
            setInitialFormData(parsedFormData);
            setAiOutput(result[0].aiResponse || "");
          }
        } catch (error) {
          console.error("Error fetching history data:", error);
        }
      }
    };

    fetchHistoryData();
  }, [historyId]);

  const GenerateAIContent = async (formData: any) => {
    if (userDetail?.credits === 0 || totalUsage >= userDetail.credits * 1000) {
      toast.error("Not enough credits. Please upgrade.");
      router.push("/dashboard/billing");
      return;
    }

    setLoading(true);
    const SelectedPrompt = selectedTemplate?.aiPrompt;
    const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;
    const result = await chatSession.sendMessage(FinalAIPrompt);

    const aiResponse = result?.response.text();
    setAiOutput(aiResponse);
    await SaveInDb(formData, selectedTemplate?.slug, aiResponse);
    setLoading(false);
    setUpdateCreditUsage(Date.now());
  };

  const SaveInDb = async (formData: any, slug: any, aiResp: string) => {
    const result = await db.insert(AIOutput).values({
      formData: JSON.stringify(formData), // Ensure formData is stored as a string
      templateSlug: slug,
      aiResponse: aiResp,
      createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
      createdAt: moment().format("DD/MM/yyyy"),
    });
    console.log("RESULT:", result);
  };

  return (
    <div className="p-10">
      <Link href={"/dashboard"}>
        <Button>
          <ArrowLeft /> Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading}
          initialData={initialFormData}
        />
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
}

export default CreateNewContent;
