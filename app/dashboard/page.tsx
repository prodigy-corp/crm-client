"use client";

import { useAuth } from "@/hooks/use-auth";
import { isEmployee, isClient } from "@/lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LuUser, LuClock, LuDollarSign, LuBriefcase, LuFileText, LuTrendingUp } from "react-icons/lu";
import Link from "next/link";
import { Route } from "next";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const userIsEmployee = isEmployee(user);
    const userIsClient = isClient(user);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome back, {user.name}!
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Here's an overview of your account
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Profile Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profile</CardTitle>
                        <LuUser className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {user.roles?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active role{user.roles?.length !== 1 ? 's' : ''}
                        </p>
                        <Link href={"/dashboard/profile" as Route} className="mt-2 inline-block">
                            <Button variant="link" size="sm" className="p-0 h-auto">
                                View profile →
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Employee-specific stats */}
                {userIsEmployee && (
                    <>
                        <Link href={"/dashboard/attendance" as Route} className="block">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                                    <LuClock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">--</div>
                                    <p className="text-xs text-muted-foreground">
                                        This month
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href={"/dashboard/salary" as Route} className="block">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Salary</CardTitle>
                                    <LuDollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">৳--</div>
                                    <p className="text-xs text-muted-foreground">
                                        Latest payment
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </>
                )}

                {/* Client-specific stats */}
                {userIsClient && (
                    <>
                        <Link href={"/dashboard/projects" as Route} className="block">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Projects</CardTitle>
                                    <LuBriefcase className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">--</div>
                                    <p className="text-xs text-muted-foreground">
                                        Active projects
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href={"/dashboard/invoices" as Route} className="block">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Invoices</CardTitle>
                                    <LuFileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">৳--</div>
                                    <p className="text-xs text-muted-foreground">
                                        Outstanding
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </>
                )}

                {/* Performance (for all) */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Activity</CardTitle>
                        <LuTrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">100%</div>
                        <p className="text-xs text-muted-foreground">
                            Completion rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Frequently used features and shortcuts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Link href={"/dashboard/profile" as Route} className="block">
                            <Button variant="outline" className="w-full justify-start" size="lg">
                                <LuUser className="mr-2 h-5 w-5" />
                                View Profile
                            </Button>
                        </Link>

                        {userIsEmployee && (
                            <>
                                <Link href={"/dashboard/attendance" as Route} className="block">
                                    <Button variant="outline" className="w-full justify-start" size="lg">
                                        <LuClock className="mr-2 h-5 w-5" />
                                        View Attendance
                                    </Button>
                                </Link>
                                <Link href={"/dashboard/salary" as Route} className="block">
                                    <Button variant="outline" className="w-full justify-start" size="lg">
                                        <LuDollarSign className="mr-2 h-5 w-5" />
                                        View Salary
                                    </Button>
                                </Link>
                            </>
                        )}

                        {userIsClient && (
                            <>
                                <Link href={"/dashboard/projects" as Route} className="block">
                                    <Button variant="outline" className="w-full justify-start" size="lg">
                                        <LuBriefcase className="mr-2 h-5 w-5" />
                                        View Projects
                                    </Button>
                                </Link>
                                <Link href={"/dashboard/invoices" as Route} className="block">
                                    <Button variant="outline" className="w-full justify-start" size="lg">
                                        <LuFileText className="mr-2 h-5 w-5" />
                                        View Invoices
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                        Your latest updates and notifications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No recent activity to display</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
