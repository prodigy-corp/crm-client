import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";


const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;