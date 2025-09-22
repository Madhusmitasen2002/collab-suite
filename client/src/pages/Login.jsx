import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const res = await fetch("https://collab-suite.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ using cookies
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setFormError(data.error || "Login failed");
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success("✅ Login successful");
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-white to-blue-200">
      <div
        className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 
                   transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Remote Work Suite
        </h2>
        <p className="mt-2 text-center text-gray-500">Welcome back! Please log in.</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border p-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border p-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
            <div className="text-right mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {formError && (
            <p className="text-red-500 text-sm text-center">{formError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg 
                      bg-indigo-600 py-2 text-black font-semibold 
                      hover:bg-white hover:text-indigo-600 border border-indigo-600 
                      transition-transform transform hover:scale-105"
          >
            <ArrowRight size={18} /> Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>

  );
}
