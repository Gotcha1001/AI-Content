"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { db } from "@/app/utils/db";
import { AIOutput } from "@/app/utils/schema";
import Image from "next/image";
import Link from "next/link";
import { Clipboard } from "lucide-react";
import Templates from "@/app/(data)/Templates";
import { toast } from "sonner";

// Updated interfaces to match exact types
interface FormField {
  label: string;
  field: string;
  name: string;
  required?: boolean;
  options?: string[];
}

interface TEMPLATE {
  name: string;
  desc: string;
  category: string;
  icon: string;
  aiPrompt: string;
  slug: string;
  form: FormField[];
}

interface DBRecord {
  id: number;
  formData: string;
  aiResponse: string | null;
  templateSlug: string;
  createdBy: string;
  createdAt: string | null;
}

export interface HistoryItem extends DBRecord {
  template?: TEMPLATE | null;
}

const History = () => {
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await db
          .select()
          .from(AIOutput)
          .where(
            eq(
              AIOutput.createdBy,
              user?.primaryEmailAddress?.emailAddress ?? ""
            )
          );

        const historyWithTemplates: HistoryItem[] = res.map(
          (record: DBRecord) => ({
            ...record,
            template:
              Templates.find((t: any) => t.slug === record.templateSlug) ||
              null,
          })
        );

        setHistory(historyWithTemplates);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, isLoaded]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied To Your Clipboard");
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Please sign in to view history.</p>
      </div>
    );
  }

  const TemplateCell = ({ item }: { item: HistoryItem }) => (
    <Link
      href={`/dashboard/content/${
        item.template?.slug || item.templateSlug
      }?id=${item.id}`}
      className="flex items-center gap-3 hover:bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      {item.template?.icon ? (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-md">
          <Image
            src={item.template.icon}
            alt={item.template.name}
            className="object-contain"
            fill
            sizes="40px"
          />
        </div>
      ) : (
        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-400">No icon</span>
        </div>
      )}
      <span className="font-medium text-gray-200">
        {item.template?.name || item.templateSlug}
      </span>
    </Link>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="animated-bg fixed -z-10 inset-0 opacity-90" />
      <h1 className="text-4xl font-semibold mb-4 text-gray-100 gradient-title text-center">
        AI Content History
      </h1>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <th className="p-4 border-b border-gray-700">Template</th>
              <th className="p-4 border-b border-gray-700">AI Response</th>
              <th className="p-4 border-b border-gray-700">Date</th>
              <th className="p-4 border-b border-gray-700">Words</th>
              <th className="p-4 border-b border-gray-700">Copy</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-700 last:border-0 hover:bg-gradient-to-r from-indigo-800 via-rose-700 to-blue-800 transition-all duration-300 ease-in-out"
                >
                  <td className="p-4">
                    <TemplateCell item={item} />
                  </td>
                  <td className="p-4 max-w-lg">
                    <p className="line-clamp-3 text-gray-300">
                      {item.aiResponse}
                    </p>
                  </td>
                  <td className="p-4 text-gray-400">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="p-4 text-center text-gray-300">
                    {item.aiResponse?.split(/\s+/).length || 0}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleCopy(item.aiResponse || "")}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Copy to clipboard"
                      disabled={!item.aiResponse}
                    >
                      <Clipboard size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-400">
                  No history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
