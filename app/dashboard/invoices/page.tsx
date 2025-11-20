"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LuFileText } from "react-icons/lu";

export default function InvoicesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Invoices</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    View and download your invoices
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>History of your invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <LuFileText className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No invoices found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            You don't have any invoices at the moment.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
