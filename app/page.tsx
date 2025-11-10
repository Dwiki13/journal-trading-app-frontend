"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Spinner } from "@/components/ui/spinner";

export default function HomeRedirect() {
  const router = useRouter();
  const { token, user } = useAuthStore();

  useEffect(() => {
    // cek token dan user
    const localToken = localStorage.getItem("token");

    if (localToken) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="h-10 w-10 text-zinc-700 dark:text-zinc-200" />
    </div>
  );
}
