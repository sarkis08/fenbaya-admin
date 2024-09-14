"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ImagePlus, TrashIcon } from "lucide-react";
import Image from "next/image";

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // onUpload image function logic
  const handleUpload = (results: any) => {
    if (results.event === 'success') {
      console.log(results);
      onChange(results.info.secure_url)
      
    }
  };

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      {" "}
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant={"destructive"}
                size={"icon"}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              src={url}
              alt="image"
              
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={handleUpload}  uploadPreset="mmenobgc">
        {({ open }) => {
          const onClick = (() => {
            open();
          })
          return (
            <Button
              type="button"
              disabled={disabled}
              onClick={onClick}
              variant={"secondary"}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
      
    </div>
  );
};

export default ImageUpload;
