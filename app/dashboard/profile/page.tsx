"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeAssets } from "@/hooks/use-assets";
import { useAuth } from "@/hooks/use-auth";
import {
  useEmployeeProfile,
  useUpdateEmployeeProfile,
  useUploadEmployeePhoto,
} from "@/hooks/use-employee";
import { isEmployee } from "@/lib/permissions";
import { format } from "date-fns";
import { useState } from "react";
import {
  LuBox,
  LuBriefcase,
  LuCalendar,
  LuCreditCard,
  LuLaptop,
  LuMail,
  LuPhone,
  LuSave,
  LuSmartphone,
  LuUpload,
  LuUser,
} from "react-icons/lu";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const isEmployeeUser = isEmployee(user);

  const { data: profile, isLoading: profileLoading } = useEmployeeProfile({
    enabled: !!user && isEmployeeUser,
  });
  const updateProfile = useUpdateEmployeeProfile();
  const uploadPhoto = useUploadEmployeePhoto();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    alternativeContactNumber: "",
    emergencyContactNumber: "",
    facebookProfileLink: "",
  });

  const handleEdit = () => {
    if (profile?.data) {
      setFormData({
        mobileNumber: profile.data.mobileNumber || "",
        alternativeContactNumber: profile.data.alternativeContactNumber || "",
        emergencyContactNumber: profile.data.emergencyContactNumber || "",
        facebookProfileLink: profile.data.facebookProfileLink || "",
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhoto.mutate(file);
    }
  };

  if (authLoading || (isEmployeeUser && profileLoading)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!isEmployeeUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View your personal information
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <LuUser className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{user?.name || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <LuMail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{user?.email || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <LuBriefcase className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {user?.roles?.join(", ") || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const employee = profile?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your personal information
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <LuUser className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateProfile.isPending}>
              <LuSave className="mr-2 h-4 w-4" />
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Photo Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-4">
              {employee?.photoUrl ? (
                <img
                  src={employee.photoUrl}
                  alt={employee.name}
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/10"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-4xl font-bold text-white ring-4 ring-primary/10">
                  {employee?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                <LuUpload className="h-4 w-4" />
                Upload Photo
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={uploadPhoto.isPending}
              />
            </Label>
            {uploadPhoto.isPending && (
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            )}
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Name (Read Only) */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <LuUser className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{employee?.name || "N/A"}</span>
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <LuMail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {employee?.user?.email || "N/A"}
                  </span>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                {isEditing ? (
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, mobileNumber: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                    <LuPhone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {employee?.mobileNumber || "N/A"}
                    </span>
                  </div>
                )}
              </div>

              {/* Alternative Contact */}
              <div className="space-y-2">
                <Label htmlFor="alternativeContactNumber">
                  Alternative Contact
                </Label>
                {isEditing ? (
                  <Input
                    id="alternativeContactNumber"
                    value={formData.alternativeContactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        alternativeContactNumber: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                    <LuPhone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {employee?.alternativeContactNumber || "N/A"}
                    </span>
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2">
                <Label htmlFor="emergencyContactNumber">
                  Emergency Contact
                </Label>
                {isEditing ? (
                  <Input
                    id="emergencyContactNumber"
                    value={formData.emergencyContactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactNumber: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                    <LuPhone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {employee?.emergencyContactNumber || "N/A"}
                    </span>
                  </div>
                )}
              </div>

              {/* Facebook Profile */}
              <div className="space-y-2">
                <Label htmlFor="facebookProfileLink">Facebook Profile</Label>
                {isEditing ? (
                  <Input
                    id="facebookProfileLink"
                    value={formData.facebookProfileLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        facebookProfileLink: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                    <LuUser className="h-4 w-4 text-gray-500" />
                    <span className="text-sm break-all">
                      {employee?.facebookProfileLink || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
          <CardDescription>Your work-related information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Employee Code */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-gray-400">
                Employee Code
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <LuBriefcase className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">
                  {employee?.employeeCode || "N/A"}
                </span>
              </div>
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-gray-400">
                Designation
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <LuBriefcase className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">
                  {employee?.designation || "N/A"}
                </span>
              </div>
            </div>

            {/* National ID */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-gray-400">
                National ID
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <LuUser className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">
                  {employee?.nationalId || "N/A"}
                </span>
              </div>
            </div>

            {/* Join Date */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-gray-400">
                Join Date
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <LuCalendar className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">
                  {employee?.joiningDate
                    ? format(new Date(employee.joiningDate), "MMM d, yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Base Salary */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-gray-400">
                Base Salary
              </Label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <span className="text-lg font-bold text-primary">
                  ৳{employee?.baseSalary || "0"}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-gray-400">Status</Label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    employee?.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {employee?.status || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AssignedAssetsCard employeeId={employee?.id} />
    </div>
  );
}

function AssignedAssetsCard({ employeeId }: { employeeId?: string }) {
  const { data: assets, isLoading } = useEmployeeAssets(employeeId || "");

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("laptop")) return <LuLaptop className="h-5 w-5" />;
    if (t.includes("phone")) return <LuSmartphone className="h-5 w-5" />;
    if (t.includes("card") || t.includes("id"))
      return <LuCreditCard className="h-5 w-5" />;
    return <LuBox className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Assets</CardTitle>
        <CardDescription>
          Company assets currently assigned to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Loading assets...
          </div>
        ) : assets && assets.data.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.data.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  {getIcon(item.asset?.type || "")}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold">{item.asset?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.asset?.type} • {item.asset?.serialNumber}
                  </div>
                  <div className="pt-1 text-[10px] text-muted-foreground italic">
                    Assigned: {format(new Date(item.assignedAt), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed bg-muted/30 py-8 text-center">
            <LuBox className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No assets assigned yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
