"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import {
    AdminClient,
    UpdateAdminClientDto,
    ClientStatus,
    ClientType,
} from "@/lib/api/admin";
import { useUpdateClient } from "@/hooks/use-admin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";

interface EditClientDialogProps {
    client: AdminClient;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditClientDialog({
    client,
    open,
    onOpenChange,
}: EditClientDialogProps) {
    const updateClientMutation = useUpdateClient();

    const [formData, setFormData] = useState<UpdateAdminClientDto>({});

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                clientCode: client.clientCode || undefined,
                companyName: client.companyName || undefined,
                clientType: client.clientType,
                mobileNumber: client.mobileNumber || undefined,
                alternativeContactNumber: client.alternativeContactNumber || undefined,
                emailAddress: client.emailAddress || undefined,
                address: client.address || undefined,
                city: client.city || undefined,
                state: client.state || undefined,
                zipCode: client.zipCode || undefined,
                country: client.country || undefined,
                industry: client.industry || undefined,
                website: client.website || undefined,
                taxId: client.taxId || undefined,
                registrationNumber: client.registrationNumber || undefined,
                contractStartDate: client.contractStartDate || undefined,
                contractEndDate: client.contractEndDate || undefined,
                creditLimit: client.creditLimit,
                outstandingBalance: client.outstandingBalance,
                notes: client.notes || undefined,
                status: client.status,
            });
        }
    }, [client]);

    const handleInputChange =
        (field: keyof UpdateAdminClientDto) =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = event.target.value;
                setFormData((prev) => ({
                    ...prev,
                    [field]: value,
                }));
            };

    const handleNumberChange =
        (field: keyof UpdateAdminClientDto) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                setFormData((prev) => ({
                    ...prev,
                    [field]: value ? Number(value) : 0,
                }));
            };

    const handleStatusChange = (value: ClientStatus) => {
        setFormData((prev) => ({
            ...prev,
            status: value,
        }));
    };

    const handleTypeChange = (value: ClientType) => {
        setFormData((prev) => ({
            ...prev,
            clientType: value,
        }));
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        updateClientMutation.mutate(
            { id: client.id, data: formData },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Client</DialogTitle>
                    <DialogDescription>
                        Update client information, contacts, and financial details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Basic Information</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="clientCode">Client Code</Label>
                                <Input
                                    id="clientCode"
                                    value={formData.clientCode || ""}
                                    onChange={handleInputChange("clientCode")}
                                    placeholder="CL25001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ""}
                                    onChange={handleInputChange("name")}
                                    required
                                    placeholder="John Doe or Company Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    value={formData.companyName || ""}
                                    onChange={handleInputChange("companyName")}
                                    placeholder="ABC Corporation"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientType">Client Type</Label>
                                <Select
                                    value={formData.clientType || "INDIVIDUAL"}
                                    onValueChange={(value) =>
                                        handleTypeChange(value as ClientType)
                                    }
                                >
                                    <SelectTrigger id="clientType">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                                        <SelectItem value="BUSINESS">Business</SelectItem>
                                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status || "ACTIVE"}
                                    onValueChange={(value) =>
                                        handleStatusChange(value as ClientStatus)
                                    }
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Contact Information</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="mobileNumber">Mobile Number</Label>
                                <Input
                                    id="mobileNumber"
                                    value={formData.mobileNumber || ""}
                                    onChange={handleInputChange("mobileNumber")}
                                    placeholder="+8801..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="alternativeContactNumber">
                                    Alternative Contact
                                </Label>
                                <Input
                                    id="alternativeContactNumber"
                                    value={formData.alternativeContactNumber || ""}
                                    onChange={handleInputChange("alternativeContactNumber")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emailAddress">Email Address</Label>
                                <Input
                                    id="emailAddress"
                                    type="email"
                                    value={formData.emailAddress || ""}
                                    onChange={handleInputChange("emailAddress")}
                                    placeholder="client@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website || ""}
                                    onChange={handleInputChange("website")}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address || ""}
                                    onChange={handleInputChange("address")}
                                    placeholder="Street address"
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city || ""}
                                    onChange={handleInputChange("city")}
                                />
                            </div>
                            <div className="space-y -2">
                                <Label htmlFor="state">State/Province</Label>
                                <Input
                                    id="state"
                                    value={formData.state || ""}
                                    onChange={handleInputChange("state")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zipCode">Zip Code</Label>
                                <Input
                                    id="zipCode"
                                    value={formData.zipCode || ""}
                                    onChange={handleInputChange("zipCode")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country || ""}
                                    onChange={handleInputChange("country")}
                                    placeholder="Bangladesh"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Business Information</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    value={formData.industry || ""}
                                    onChange={handleInputChange("industry")}
                                    placeholder="Software, Retail, Manufacturing..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taxId">Tax ID</Label>
                                <Input
                                    id="taxId"
                                    value={formData.taxId || ""}
                                    onChange={handleInputChange("taxId")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">
                                    Registration Number
                                </Label>
                                <Input
                                    id="registrationNumber"
                                    value={formData.registrationNumber || ""}
                                    onChange={handleInputChange("registrationNumber")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">
                            Contract & Financial Information
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="contractStartDate">Contract Start Date</Label>
                                <Input
                                    id="contractStartDate"
                                    type="date"
                                    value={formData.contractStartDate || ""}
                                    onChange={handleInputChange("contractStartDate")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contractEndDate">Contract End Date</Label>
                                <Input
                                    id="contractEndDate"
                                    type="date"
                                    value={formData.contractEndDate || ""}
                                    onChange={handleInputChange("contractEndDate")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="creditLimit">Credit Limit</Label>
                                <Input
                                    id="creditLimit"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={formData.creditLimit || ""}
                                    onChange={handleNumberChange("creditLimit")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="outstandingBalance">
                                    Outstanding Balance
                                </Label>
                                <Input
                                    id="outstandingBalance"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={formData.outstandingBalance || ""}
                                    onChange={handleNumberChange("outstandingBalance")}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes || ""}
                                    onChange={handleInputChange("notes")}
                                    placeholder="Additional notes about the client..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateClientMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateClientMutation.isPending || !formData.name}
                        >
                            {updateClientMutation.isPending ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Updating...
                                </>
                            ) : (
                                "Update Client"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
