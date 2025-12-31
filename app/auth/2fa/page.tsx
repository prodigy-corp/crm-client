import { Suspense } from "react";
import VerifyEmailForm from "./VerifyEmailForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
