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
import { useEmployees } from "@/hooks/use-admin";
import { useAssignAsset } from "@/hooks/use-assets";
import { Asset } from "@/lib/api/assets";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export function AssignModal({ open, onOpenChange, asset }: AssignModalProps) {
  const assignAsset = useAssignAsset();
  const { data: employees } = useEmployees();
  const { handleSubmit, reset, setValue, register } = useForm();

  useEffect(() => {
    if (open) {
      reset({ employeeId: "", condition: "Brand New" });
    }
  }, [open, reset]);

  const onSubmit = (data: any) => {
    if (!asset) return;
    assignAsset.mutate(
      { id: asset.id, ...data },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Assign Asset: {asset?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Employee</Label>
            <Select
              onValueChange={(val) => setValue("employeeId", val)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Search employee..." />
              </SelectTrigger>
              <SelectContent>
                {employees?.data?.map((emp: any) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Asset Condition</Label>
            <Input
              id="condition"
              {...register("condition")}
              placeholder="e.g. Excellent, Scratches on lid"
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
            <Button type="submit" disabled={assignAsset.isPending}>
              Assign Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
