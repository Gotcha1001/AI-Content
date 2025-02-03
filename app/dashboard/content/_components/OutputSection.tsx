import React, { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import "tui-color-picker/dist/tui-color-picker.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

interface PROPS {
  aiOutput: string;
}

function OutputSection({ aiOutput }: PROPS) {
  const editorRef: any = useRef();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const editorInstance = editorRef.current.getInstance();
    editorInstance.setMarkdown(aiOutput);
  }, [aiOutput]);

  const handleCopy = async () => {
    try {
      const editorInstance = editorRef.current.getInstance();
      const htmlContent = editorInstance.getHTML();

      // Create a Blob with HTML content
      const blob = new Blob([htmlContent], { type: "text/html" });

      // Create ClipboardItem with both HTML and plain text formats
      const data = new ClipboardItem({
        "text/html": blob,
        "text/plain": new Blob([editorInstance.getMarkdown()], {
          type: "text/plain",
        }),
      });

      // Write to clipboard
      await navigator.clipboard.write([data]);

      // Visual feedback
      setCopied(true);
      toast.success("Copied to clipboard!");

      // Reset copy button after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback to plain text if advanced clipboard API fails
      const plainText = editorRef.current.getInstance().getMarkdown();
      await navigator.clipboard.writeText(plainText);
      toast.error("Color formatting may not be preserved");
    }
  };

  return (
    <div className="bg-white shadow-lg border border-teal-500 rounded-xl">
      <div className="flex justify-between items-center p-5">
        <h2 className="gradient-title text-2xl">Your Result</h2>
        <Button
          onClick={handleCopy}
          className="flex items-center gap-2 transition-all duration-200"
          variant={copied ? "sex" : "sex1"}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      <Editor
        ref={editorRef}
        initialValue="Your Result Will Appear Here..."
        initialEditType="wysiwyg"
        height="600px"
        useCommandShortcut={true}
        plugins={[colorSyntax]}
        onChange={() =>
          console.log(editorRef.current.getInstance().getMarkdown())
        }
      />
    </div>
  );
}

export default OutputSection;
