"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteAsset } from "@/hooks/use-assets";
import { Asset, AssetStatus } from "@/lib/api/assets";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  LuPencil,
  LuPlus,
  LuRotateCcw,
  LuTrash2,
  LuUserPlus,
} from "react-icons/lu";
import { AssetModal } from "./asset-modal";
import { AssignModal } from "./assign-modal";
import { DamageModal } from "./damage-modal";
import { ReturnModal } from "./return-modal";

interface AssetListProps {
  assets: Asset[] | undefined;
  isLoading: boolean;
}

export function AssetList({ assets, isLoading }: AssetListProps) {
  // const { data: assets, isLoading } = useAssets(); // Removed internal fetch
  const deleteAsset = useDeleteAsset();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-[10px] text-green-700 uppercase hover:bg-green-100"
          >
            Available
          </Badge>
        );
      case "ASSIGNED":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-[10px] text-blue-700 uppercase hover:bg-blue-100"
          >
            Assigned
          </Badge>
        );
      case "UNDER_REPAIR":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-[10px] text-yellow-700 uppercase hover:bg-yellow-100"
          >
            Repair
          </Badge>
        );
      case "DAMAGED":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-[10px] text-red-700 uppercase hover:bg-red-100"
          >
            Damaged
          </Badge>
        );
      case "LOST":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-800 text-[10px] text-white uppercase hover:bg-gray-800"
          >
            Lost
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] uppercase">
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading assets...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Asset Inventory</h2>
        <Button
          onClick={() => {
            setSelectedAsset(null);
            setIsAssetModalOpen(true);
          }}
          className="gap-2"
        >
          <LuPlus className="h-4 w-4" /> Add Asset
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets?.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {asset.model}
                  </div>
                </TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell className="font-mono text-xs">
                  {asset.serialNumber}
                </TableCell>
                <TableCell>{getStatusBadge(asset.status)}</TableCell>
                <TableCell>
                  {asset.assignments?.find((a) => a.isCurrent)?.employee
                    ?.name || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {asset.status === "AVAILABLE" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedAsset(asset);
                          setIsAssignModalOpen(true);
                        }}
                        title="Assign Asset"
                      >
                        <LuUserPlus className="h-4 w-4 text-blue-600" />
                      </Button>
                    )}
                    {asset.status === "ASSIGNED" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedAsset(asset);
                          setIsReturnModalOpen(true);
                        }}
                        title="Return Asset"
                      >
                        <LuRotateCcw className="h-4 w-4 text-orange-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsDamageModalOpen(true);
                      }}
                      title="Report Damage/Loss"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsAssetModalOpen(true);
                      }}
                    >
                      <LuPencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Delete this asset?"))
                          deleteAsset.mutate(asset.id);
                      }}
                    >
                      <LuTrash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {assets?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No assets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AssetModal
        open={isAssetModalOpen}
        onOpenChange={setIsAssetModalOpen}
        asset={selectedAsset}
      />
      <AssignModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        asset={selectedAsset}
      />
      <ReturnModal
        open={isReturnModalOpen}
        onOpenChange={setIsReturnModalOpen}
        asset={selectedAsset}
      />
      <DamageModal
        open={isDamageModalOpen}
        onOpenChange={setIsDamageModalOpen}
        asset={selectedAsset}
      />
    </div>
  );
}
