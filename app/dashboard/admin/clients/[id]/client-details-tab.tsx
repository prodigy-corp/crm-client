"use client";

import { Card } from "@/components/ui/card";
import { AdminClientDetail } from "@/lib/api/admin";
import { format } from "date-fns";
import {
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

interface ClientDetailsTabProps {
  client: AdminClientDetail;
}

export function ClientDetailsTab({ client }: ClientDetailsTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          Contact Information
        </h3>
        <div className="space-y-4 text-sm">
          {client.mobileNumber && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Mobile</p>
                <p className="font-medium">{client.mobileNumber}</p>
              </div>
            </div>
          )}
          {client.alternativeContactNumber && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Alternative Contact</p>
                <p className="font-medium">{client.alternativeContactNumber}</p>
              </div>
            </div>
          )}
          {client.emailAddress && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{client.emailAddress}</p>
              </div>
            </div>
          )}
          {(client.address || client.city || client.country) && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">
                  {[
                    client.address,
                    client.city,
                    client.state,
                    client.zipCode,
                    client.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Business Information */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Building className="h-5 w-5" />
          Business Information
        </h3>
        <div className="space-y-4 text-sm">
          {client.companyName && (
            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Company Name</p>
                <p className="font-medium">{client.companyName}</p>
              </div>
            </div>
          )}
          {client.industry && (
            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Industry</p>
                <p className="font-medium">{client.industry}</p>
              </div>
            </div>
          )}
          {client.website && (
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Website</p>
                <a
                  href={
                    client.website.startsWith("http")
                      ? client.website
                      : `https://${client.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {client.website}
                </a>
              </div>
            </div>
          )}
          {client.taxId && (
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Tax ID</p>
                <p className="font-medium">{client.taxId}</p>
              </div>
            </div>
          )}
          {client.registrationNumber && (
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Registration Number</p>
                <p className="font-medium">{client.registrationNumber}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Contract & Financial Information */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="h-5 w-5" />
          Contract & Financial
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-muted-foreground">Contract Period</p>
              <p className="font-medium">
                {client.contractStartDate
                  ? format(new Date(client.contractStartDate), "PPP")
                  : "N/A"}{" "}
                -{" "}
                {client.contractEndDate
                  ? format(new Date(client.contractEndDate), "PPP")
                  : "Ongoing"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-muted-foreground">Credit Limit</p>
              <p className="font-medium">
                {client.creditLimit?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-muted-foreground">Outstanding Balance</p>
              <p
                className={`font-medium ${client.outstandingBalance > 0 ? "text-destructive" : "text-green-600"}`}
              >
                {client.outstandingBalance?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes */}
      {client.notes && (
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5" />
            Notes
          </h3>
          <div className="text-sm whitespace-pre-wrap text-muted-foreground">
            {client.notes}
          </div>
        </Card>
      )}
    </div>
  );
}
