"use client"

import { Plus } from "lucide-react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { ApiList } from "@/components/api-list";

type Props = {
 data: SizeColumn[]
}
export const SizeClient = ({
    data
}: Props) => {
    const router = useRouter()
    const params = useParams()
    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${data.length})`}
                    description="Manage sizes for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Size
                </Button>
            </div>
            <Separator />
            {/* Billboard List */}
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API calls for sizes" />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId" />
        </>
    );
}