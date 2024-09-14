"use client"

import { Plus } from "lucide-react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { ApiList } from "@/components/api-list";

type Props = {
 data: BillboardColumn[]
}
export const BillboardClient = ({
    data
}: Props) => {
    const router = useRouter()
    const params = useParams()
    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.length})`}
                    description="Manage billboards for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Billboard
                </Button>
            </div>
            <Separator />
            {/* Billboard List */}
            <DataTable searchKey="label" columns={columns} data={data} />
            <Heading title="API" description="API calls for Billboards" />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
    );
}