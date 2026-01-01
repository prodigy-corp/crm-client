"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import { LuClock, LuHistory, LuPlus } from "react-icons/lu";

interface TimeLog {
  id: string;
  hours: number;
  description?: string;
  logDate: string;
  user: {
    name: string;
  };
}

interface TimeTrackingProps {
  logs: TimeLog[];
  onAddLog: (data: {
    hours: number;
    description?: string;
    logDate?: string;
  }) => void;
  isAdding: boolean;
}

export const TimeTracking = ({
  logs,
  onAddLog,
  isAdding,
}: TimeTrackingProps) => {
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [logDate, setLogDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || isNaN(parseFloat(hours))) return;

    onAddLog({
      hours: parseFloat(hours),
      description: description || undefined,
      logDate: logDate ? new Date(logDate).toISOString() : undefined,
    });

    setHours("");
    setDescription("");
  };

  const totalHours = logs.reduce((acc, log) => acc + Number(log.hours), 0);

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <LuClock className="h-4 w-4 text-primary" />
            Log Work Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
          >
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-xs">
                Hours
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                placeholder="0.0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-xs">
                Description (Optional)
              </Label>
              <Input
                id="description"
                placeholder="What did you work on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isAdding} className="w-full">
              <LuPlus className="mr-2 h-4 w-4" />
              Log Time
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <LuHistory className="h-5 w-5 text-primary" />
            Time History
          </CardTitle>
          <div className="rounded-full bg-secondary px-3 py-1 text-sm font-bold">
            Total: {totalHours.toFixed(1)}h
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground italic">
              No time logs recorded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.logDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.user.name}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {log.description || "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {Number(log.hours).toFixed(1)}h
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
