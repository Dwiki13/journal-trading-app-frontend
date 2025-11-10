"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, Mail } from "lucide-react";

export default function LoginPage() {
  const loginUser = useAuthStore((state) => state.loginUser);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      alert(`Login berhasil, welcome ${user.email}`);
      router.push("/dashboard"); // arahkan ke halaman dashboard
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg transition-colors duration-300 mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-zinc-50">
        Welcome Back
      </h1>

      <div className="flex flex-col gap-4">
        {/* Email */}
        <div className="relative">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 w-full transition-all duration-200"
          />
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-300"
            size={18}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 w-full transition-all duration-200"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-50 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Button Login */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors rounded-lg shadow-sm"
        >
          {loading && <Spinner className="h-5 w-5 text-white" />}
          {loading ? "Loading..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
