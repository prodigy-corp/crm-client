"use client";

import { AssetList } from "./_components/asset-list";

export default function AssetsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
        <p className="text-muted-foreground">
          Track and manage company assets, assignments, and lifecycle.
        </p>
      </div>

      <AssetList />
    </div>
  );
}
