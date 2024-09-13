"use client"

import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge, BadgeProps } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public API",
  admin: "Admin API",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
    const onCopy = () => {
        navigator.clipboard.writeText(description);
        toast.success("Copied to clipboard");
      };
    
  return (
    <Alert
      className={`bg-${variantMap[variant]}-100 border-${variantMap[variant]}-400 text-${variantMap[variant]}-800 px-4 py-3 rounded-md shadow-md mb-4`}
    >
      <div>
        <div className="flex">
        <Server className="h-4 w-4" />
        <AlertTitle className="flex items-center ml-3 gap-x-2">
          {title} -{" "}
          <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
        </AlertTitle>
        </div>
       
        <div className="flex items-center justify-between">
          <AlertDescription>
            <code className="relative ml-2 rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {description}
            </code>
          </AlertDescription>
          <Button variant={"outline"} size={"icon"} onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
