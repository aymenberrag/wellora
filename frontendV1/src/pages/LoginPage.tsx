import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Droplets } from "lucide-react";
import { login } from "../services/auth";
import { storage } from "../services/storage";

export default function LoginPage() {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login({
        employee_id: employeeId,
        password,
      });

      storage.save(data);

      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid Employee ID or Password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <Droplets className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold">Wellora</h1>

          <p className="mt-2 text-slate-500">
            Enterprise Well Management
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Employee ID
            </label>

            <input
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Employee ID"
            />
          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-600"
                placeholder="Password"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

      </div>

    </div>
  );
}