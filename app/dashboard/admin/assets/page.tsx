"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssets } from "@/hooks/use-assets";
import { AssetStatus } from "@/lib/api/assets";
import { useMemo, useState } from "react";
import {
  LuTriangle,
  LuArchive,
  LuBox,
  LuChevronLeft,
  LuChevronRight,
  LuDollarSign,
  LuFilter,
  LuSearch,
  LuX,
} from "react-icons/lu";
import { AssetList } from "./_components/asset-list";

export default function AssetsPage() {
  const { data: assets, isLoading } = useAssets();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // -- Stats Calculation --
  const stats = useMemo(() => {
    if (!assets)
      return {
        totalAssets: 0,
        totalValue: 0,
        assignedCount: 0,
        availableCount: 0,
        damagedCount: 0,
        damagedValue: 0,
      };

    return assets.reduce(
      (acc, asset) => {
        acc.totalAssets++;
        const value = Number(asset.value || 0);
        acc.totalValue += value;

        if (asset.status === "ASSIGNED") acc.assignedCount++;
        if (asset.status === "AVAILABLE") acc.availableCount++;
        if (asset.status === "DAMAGED" || asset.status === "LOST") {
          acc.damagedCount++;
          acc.damagedValue += value;
        }

        return acc;
      },
      {
        totalAssets: 0,
        totalValue: 0,
        assignedCount: 0,
        availableCount: 0,
        damagedCount: 0,
        damagedValue: 0,
      },
    );
  }, [assets]);

  // -- Filtering & Search --
  const filteredAssets = useMemo(() => {
    if (!assets) return [];

    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || asset.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assets, searchTerm, statusFilter]);

  // -- Pagination --
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
        <p className="text-muted-foreground">
          Track company assets, view lifecycle stats, and manage assignments.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <LuBox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableCount} Available for assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <LuDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <LuArchive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently assigned to employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loss / Damage</CardTitle>
            <LuTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${stats.damagedValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.damagedCount} items affected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full md:max-w-xs">
            <LuSearch className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val as AssetStatus | "ALL");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <LuFilter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="UNDER_REPAIR">Under Repair</SelectItem>
              <SelectItem value="DAMAGED">Damaged</SelectItem>
              <SelectItem value="LOST">Lost</SelectItem>
              <SelectItem value="DISPOSED">Disposed</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || statusFilter !== "ALL") && (
            <Button variant="ghost" size="icon" onClick={handleResetFilters}>
              <LuX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Asset List & Pagination */}
      <div className="space-y-4">
        <AssetList assets={paginatedAssets} isLoading={isLoading} />

        {/* Pagination Controls */}
        {!isLoading && filteredAssets.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredAssets.length)}
              </span>{" "}
              of <span className="font-medium">{filteredAssets.length}</span>{" "}
              assets
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <LuChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <LuChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
