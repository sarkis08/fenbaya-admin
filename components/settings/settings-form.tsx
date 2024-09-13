"use client";

import * as z from "zod";

import { Store } from "@prisma/client";
import { Heading } from "../heading";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AlertModal } from "../modals/alert-modal";
import { ApiAlert } from "../api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const settingsFormSchema = z.object({
  name: z.string().min(1),
});

type settingsFormValues = z.infer<typeof settingsFormSchema>;

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const origin = useOrigin()

  const settingsForm = useForm<settingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: settingsFormValues) => {
    try {
      //console.log(data);
      setLoading(true);
      // Update store logic here
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      setTimeout(() => {
        toast.success("Store updated successfully");
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
        toast.success("Store deleted successfully");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loadings={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store settings" />
        <Button
          disabled={loading}
          variant={"destructive"}
          size={"sm"}
          onClick={() => setOpen(true)}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...settingsForm}>
        <form
          onSubmit={settingsForm.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={settingsForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Name of Store"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">
            {!loading ? (
              "Save Changes"
            ) : (
              <span className="ml-2 text-sm text-gray-500">Saving...</span>
            )}
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="FENBAYA_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </>
  );
};

export { SettingsForm };
