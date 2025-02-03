"use client";
import React, { useState, useEffect } from "react";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Image from "next/image";
import FeatureMotionWrapper from "@/app/_components/FramerMotionStuff/FeatureMotionWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";

interface PROPS {
  selectedTemplate?: TEMPLATE;
  userFormInput: any;
  loading: boolean;
  initialData?: any;
}

function FormSection({
  selectedTemplate,
  userFormInput,
  loading,
  initialData,
}: PROPS) {
  const [formData, setFormData] = useState<any>(initialData || {});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    userFormInput(formData);
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-5 shadow-lg border rounded-lg bg-indigo-800">
      <Image
        src={selectedTemplate?.icon ?? "/logo.png"}
        alt="template icon"
        height={70}
        width={70}
      />

      <h2 className="text-primary font-bold text-2xl mb-2">
        {selectedTemplate?.name}
      </h2>
      <p className="text-gray-400 text-sm">{selectedTemplate?.desc}</p>
      <form onSubmit={onSubmit} className="mt-5">
        {selectedTemplate?.form?.map((item, index) => (
          <FeatureMotionWrapper key={index} index={index}>
            <div className="my-2 flex flex-col gap-2 mb-7">
              <label className="text-white font-bold">{item.label}</label>
              {item.field === "input" ? (
                <Input
                  name={item.name}
                  required={item?.required}
                  onChange={handleInputChange}
                  value={formData[item.name] || ""}
                  className="text-white"
                />
              ) : item.field === "textarea" ? (
                <Textarea
                  name={item.name}
                  required={item?.required}
                  onChange={handleInputChange}
                  value={formData[item.name] || ""}
                  className="text-white"
                />
              ) : item.field === "dropdown" ? (
                <Select
                  name={item.name}
                  required={item?.required}
                  value={formData[item.name] || ""}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: item.name, value } })
                  }
                >
                  <SelectTrigger className="w-full bg-purple-700 text-white border-purple-600 focus:ring-purple-500">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-700 text-white border-purple-600">
                    {item.options?.map((option, idx) => (
                      <SelectItem
                        key={idx}
                        value={option}
                        className="focus:bg-purple-600 focus:text-white hover:bg-purple-600 hover:text-white"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>
          </FeatureMotionWrapper>
        ))}
        <Button type="submit" className="w-full py-6" disabled={loading}>
          {loading && <Loader2Icon className="animate-spin" />}
          Generate Content
        </Button>
      </form>
    </div>
  );
}

export default FormSection;
