"use client";

import { AdminUser } from "@/lib/api/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import {
  LuMail,
  LuPhone,
  LuCalendar,
  LuClock,
  LuShield,
  LuUser,
  LuCheck,
  LuX,
  LuKey,
} from "react-icons/lu";

interface ViewUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserDialog({ user, open, onOpenChange }: ViewUserDialogProps) {
  if (!user) return null;

  const isVerified = user.emailVerified || user.isEmailVerified;

  const getStatusBadge = (status: AdminUser["status"]) => {
    const variants = {
      ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      BLOCKED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };

    return (
      <Badge className={variants[status]}>
        {status.toLowerCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-medium text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(user.status)}
                {isVerified && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <LuCheck className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <LuUser className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <LuMail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <LuPhone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Roles */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <LuShield className="w-4 h-4" />
              Roles & Permissions
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((userRole, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {userRole.role.name}
                    {userRole.role.description && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({userRole.role.description})
                      </span>
                    )}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No roles assigned</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Security & Verification */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <LuKey className="w-4 h-4" />
              Security & Verification
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                {isVerified ? (
                  <LuCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <LuX className="w-4 h-4 text-red-600" />
                )}
                <span className="text-muted-foreground">Email Verified:</span>
                <span className="font-medium">{isVerified ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {user.isTwoFactorEnabled ? (
                  <LuCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <LuX className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-muted-foreground">2FA Enabled:</span>
                <span className="font-medium">{user.isTwoFactorEnabled ? "Yes" : "No"}</span>
              </div>
              {user.isSellerVerified !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  {user.isSellerVerified ? (
                    <LuCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <LuX className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-muted-foreground">Seller Verified:</span>
                  <span className="font-medium">{user.isSellerVerified ? "Yes" : "No"}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <LuCalendar className="w-4 h-4" />
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <LuCalendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LuClock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last Login:</span>
                <span className="font-medium">
                  {user.lastLoginAt
                    ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })
                    : "Never"}
                </span>
              </div>
              {user.emailVerifiedAt && (
                <div className="flex items-center gap-2">
                  <LuCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email Verified:</span>
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(user.emailVerifiedAt), { addSuffix: true })}
                  </span>
                </div>
              )}
              {user.blockedUntil && (
                <div className="flex items-center gap-2">
                  <LuX className="w-4 h-4 text-red-600" />
                  <span className="text-muted-foreground">Blocked Until:</span>
                  <span className="font-medium text-red-600">
                    {formatDistanceToNow(new Date(user.blockedUntil), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Connected Accounts */}
          {user.accounts && user.accounts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Connected Accounts</h4>
                <div className="space-y-2">
                  {user.accounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{account.provider}</Badge>
                        <span className="text-sm text-muted-foreground capitalize">
                          {account.type}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(account.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Stripe Information */}
          {user.stripeCustomerId && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Stripe Customer ID:</span>
                    <span className="font-mono text-xs">{user.stripeCustomerId}</span>
                  </div>
                  {user.stripeOnboardingComplete !== undefined && (
                    <div className="flex items-center gap-2">
                      {user.stripeOnboardingComplete ? (
                        <LuCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <LuX className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-muted-foreground">Onboarding Complete:</span>
                      <span className="font-medium">
                        {user.stripeOnboardingComplete ? "Yes" : "No"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
