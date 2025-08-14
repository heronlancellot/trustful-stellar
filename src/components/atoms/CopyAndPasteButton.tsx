"use client";

import cc from "classcat";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const CopyAndPasteButton = ({
  textToCopy,
  className,
  disabled = false,
  size = "md",
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!textToCopy || disabled) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <button
      onClick={handleCopy}
      disabled={disabled || !textToCopy}
      className={cc([
        "flex cursor-pointer items-center justify-center rounded-lg transition-all duration-200",
        "bg-[#23243a] hover:bg-[#2a2b42] active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        className,
      ])}
      aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
      title={isCopied ? "Copied!" : "Copy to clipboard"}
    >
      {isCopied ? (
        <Check className={`${iconSizes[size]} text-green-500`} />
      ) : (
        <Copy
          className={`${iconSizes[size]} text-gray-400 transition-colors hover:text-white`}
        />
      )}
    </button>
  );
};
