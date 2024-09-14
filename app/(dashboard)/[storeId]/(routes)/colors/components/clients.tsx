"use client"

import { Plus } from "lucide-react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { ApiList } from "@/components/api-list";

type Props = {
 data: ColorColumn[]
}
export const ColorClient = ({
    data
}: Props) => {
    const router = useRouter()
    const params = useParams()
    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Colors (${data.length})`}
                    description="Manage colors for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Color
                </Button>
            </div>
            <Separator />
            {/* Billboard List */}
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API calls for colors" />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    );
}