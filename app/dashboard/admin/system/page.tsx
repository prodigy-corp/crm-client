"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import {
  useAuditLogs,
  useClearCache,
  useDatabaseStats,
  useSystemHealth,
  useSystemLogs,
} from "@/hooks/use-admin";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  LuActivity,
  LuDatabase,
  LuFileText,
  LuHardDrive,
  LuRefreshCw,
  LuServer,
  LuShield,
  LuTrash2,
} from "react-icons/lu";

const AdminSystemPage = () => {
  const [activeTab, setActiveTab] = useState<
    "health" | "logs" | "audit" | "database"
  >("health");

  // Hooks
  const {
    data: health,
    isLoading: healthLoading,
    refetch: refetchHealth,
  } = useSystemHealth();
  const { data: logs, isLoading: logsLoading } = useSystemLogs();
  const { data: auditLogs, isLoading: auditLoading } = useAuditLogs();
  const { data: dbStats, isLoading: dbLoading } = useDatabaseStats();
  const clearCacheMutation = useClearCache();

  const getHealthBadge = (status: string) => {
    const variants = {
      healthy:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <Badge
        className={
          variants[status as keyof typeof variants] || variants.critical
        }
      >
        {status}
      </Badge>
    );
  };

  const getConnectionBadge = (status: string) => {
    return status === "connected" ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        Connected
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
        Disconnected
      </Badge>
    );
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">System Health & Monitoring</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetchHealth()}
            disabled={healthLoading}
          >
            <LuRefreshCw
              className={`mr-2 h-4 w-4 ${healthLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => clearCacheMutation.mutate()}
            disabled={clearCacheMutation.isPending}
          >
            <LuTrash2 className="mr-2 h-4 w-4" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {[
          { id: "health", label: "System Health", icon: LuActivity },
          { id: "logs", label: "System Logs", icon: LuFileText },
          { id: "audit", label: "Audit Logs", icon: LuShield },
          { id: "database", label: "Database Stats", icon: LuDatabase },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* System Health Tab */}
      {activeTab === "health" && (
        <div className="space-y-6">
          {healthLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          ) : health ? (
            <>
              {/* Overall Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <LuActivity className="h-5 w-5" />
                      System Status
                    </span>
                    {getHealthBadge(health.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatUptime(health.uptime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Uptime
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {health.memory.percentage}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Memory Usage
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {health?.database?.responseTime || 0}ms
                      </div>
                      <div className="text-sm text-muted-foreground">
                        DB Response
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {health?.redis?.responseTime || 0}ms
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Redis Response
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Status */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LuDatabase className="h-5 w-5" />
                      Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        {getConnectionBadge(health?.database?.status || "")}
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-mono">
                          {health?.database?.responseTime || 0}ms
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LuServer className="h-5 w-5" />
                      Redis Cache
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        {getConnectionBadge(health?.redis?.status || "")}
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-mono">
                          {health?.redis?.responseTime || 0}ms
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Memory Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LuHardDrive className="h-5 w-5" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Used: {formatBytes(health.memory.used)}</span>
                      <span>Total: {formatBytes(health.memory.total)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${health.memory.percentage}%` }}
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      {health?.memory?.percentage}% used
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Unable to load system health data
              </p>
            </div>
          )}
        </div>
      )}

      {/* System Logs Tab */}
      {activeTab === "logs" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LuFileText className="h-5 w-5" />
              System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {logs.map((log: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg bg-muted/30 p-3 font-mono text-sm"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp || new Date().toISOString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {log.level || "INFO"}
                      </Badge>
                    </div>
                    <div>{log.message || JSON.stringify(log)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No system logs available
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LuShield className="h-5 w-5" />
              Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            ) : auditLogs && auditLogs.length > 0 ? (
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="rounded-lg bg-muted/30 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{log.action}</Badge>
                        <span className="text-sm font-medium">
                          {log.resource}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{log.userName}</span>{" "}
                      performed {log.action} on {log.resource}
                      {log.resourceId && ` (ID: ${log.resourceId})`}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      IP: {log.ipAddress} • {log.userAgent}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No audit logs available
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Database Stats Tab */}
      {activeTab === "database" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LuDatabase className="h-5 w-5" />
              Database Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dbLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            ) : dbStats ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(dbStats).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-muted/30 p-4">
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-lg font-semibold">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No database statistics available
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSystemPage;
