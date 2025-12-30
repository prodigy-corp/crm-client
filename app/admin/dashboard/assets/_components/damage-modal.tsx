"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReportDamage } from "@/hooks/use-assets";
import { Asset } from "@/lib/api/assets";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface DamageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export function DamageModal({ open, onOpenChange, asset }: DamageModalProps) {
  const reportDamage = useReportDamage();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (open) reset({ description: "" });
  }, [open, reset]);

  const onSubmit = (data: any) => {
    if (!asset) return;
    reportDamage.mutate(
      { id: asset.id, description: data.description },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Report Damage/Loss: {asset?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: true })}
              placeholder="Describe the damage or loss incident..."
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
              disabled={reportDamage.isPending}
              variant="destructive"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
