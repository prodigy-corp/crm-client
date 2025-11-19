"use client";

import { useState } from "react";
import { AdminUser } from "@/lib/api/admin";
import { useUsers } from "@/hooks/use-admin";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";

interface UserSelectDropdownProps {
    value?: string;
    onChange: (userId: string | undefined) => void;
}

export function UserSelectDropdown({
    value,
    onChange,
}: UserSelectDropdownProps) {
    const [search, setSearch] = useState("");

    // Fetch users with search
    const { data: usersData, isLoading } = useUsers({
        page: 1,
        limit: 50,
        search: search || undefined,
        status: "ACTIVE",
    });

    const users = usersData?.data || [];
    const selectedUser = users.find((u: AdminUser) => u.id === value);

    // Handle selection change - convert "__none__" to undefined
    const handleChange = (selectedValue: string) => {
        if (selectedValue === "__none__") {
            onChange(undefined);
        } else {
            onChange(selectedValue);
        }
    };

    return (
        <Select value={value || "__none__"} onValueChange={handleChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select a user account...">
                    {selectedUser ? (
                        <span className="flex items-center justify-between w-full">
                            <span>{selectedUser.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                                {selectedUser.email}
                            </span>
                        </span>
                    ) : (
                        "Select a user account..."
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <div className="p-2">
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                        <Spinner className="h-4 w-4" />
                        <span className="ml-2 text-sm text-muted-foreground">
                            Loading users...
                        </span>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        {search ? "No users found" : "No active users available"}
                    </div>
                ) : (
                    <>
                        <SelectItem value="__none__">
                            <span className="italic text-muted-foreground">
                                None (Don&apos;t link to user)
                            </span>
                        </SelectItem>
                        {users.map((user: AdminUser) => (
                            <SelectItem key={user.id} value={user.id}>
                                <div className="flex flex-col py-1">
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </>
                )}
            </SelectContent>
        </Select>
    );
}
