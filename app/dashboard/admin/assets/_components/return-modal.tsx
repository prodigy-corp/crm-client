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
import { useReturnAsset } from "@/hooks/use-assets";
import { Asset } from "@/lib/api/assets";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ReturnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export function ReturnModal({ open, onOpenChange, asset }: ReturnModalProps) {
  const returnAsset = useReturnAsset();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (open) reset({ returnNote: "" });
  }, [open, reset]);

  const onSubmit = (data: any) => {
    if (!asset) return;
    returnAsset.mutate(
      { id: asset.id, returnNote: data.returnNote },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Return Asset: {asset?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="returnNote">Return Note / Condition</Label>
            <Textarea
              id="returnNote"
              {...register("returnNote")}
              placeholder="Describe the condition of the asset upon return..."
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
              disabled={returnAsset.isPending}
              variant="destructive"
            >
              Process Return
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
