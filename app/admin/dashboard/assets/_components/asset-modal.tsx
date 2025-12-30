"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAsset, useUpdateAsset } from "@/hooks/use-assets";
import { Asset } from "@/lib/api/assets";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export function AssetModal({ open, onOpenChange, asset }: AssetModalProps) {
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name,
        type: asset.type,
        model: asset.model || "",
        serialNumber: asset.serialNumber,
        purchaseDate: asset.purchaseDate
          ? new Date(asset.purchaseDate).toISOString().split("T")[0]
          : "",
        value: asset.value || 0,
        notes: asset.notes || "",
      });
    } else {
      reset({
        name: "",
        type: "Laptop",
        model: "",
        serialNumber: "",
        purchaseDate: "",
        value: 0,
        notes: "",
      });
    }
  }, [asset, reset, open]);

  const onSubmit = (data: any) => {
    if (asset) {
      updateAsset.mutate(
        { id: asset.id, data },
        {
          onSuccess: () => onOpenChange(false),
        },
      );
    } else {
      createAsset.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="e.g. MacBook Pro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Asset Type</Label>
              <Select
                onValueChange={(val) => setValue("type", val)}
                defaultValue={asset?.type || "Laptop"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="ID Card">ID Card</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                {...register("model")}
                placeholder="e.g. M1, 2021"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                {...register("serialNumber", { required: true })}
                placeholder="e.g. C02G1234ABCD"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register("purchaseDate")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Purchase Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...register("value")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              {...register("notes")}
              placeholder="Any additional details..."
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAsset.isPending || updateAsset.isPending}
            >
              {asset ? "Update Asset" : "Add Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
