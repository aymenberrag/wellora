import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/auth";
import { useTheme, type Theme } from "../context/ThemeContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage(""); setError("");
    try { await changePassword(passwords); setMessage("Password changed successfully."); setPasswords({ old_password: "", new_password: "", confirm_password: "" }); }
    catch (err: any) { setError(err.response?.data?.detail || err.response?.data?.error || "Failed to change password."); }
    finally { setSaving(false); }
  };

  return <div className="mx-auto max-w-4xl space-y-6"><div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1><p className="mt-1 text-sm text-slate-500">Manage appearance and account preferences.</p></div>{message && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>}{error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Appearance</h2><p className="mt-1 text-sm text-slate-500">Choose how Wellora looks on this device.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{(["light", "dark", "system"] as Theme[]).map((option) => <button key={option} onClick={() => setTheme(option)} className={`rounded-lg border p-4 text-left capitalize transition ${theme === option ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950" : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"}`}>{option}<span className="mt-1 block text-xs opacity-70">{option === "system" ? "Follow device preference" : `Use ${option} mode`}</span></button>)}</div></section>
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Account</h2><p className="mt-1 text-sm text-slate-500">Update profile information or password.</p></div><button onClick={() => navigate("/profile")} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Open Profile</button></div><form onSubmit={updatePassword} className="mt-6 grid gap-4 md:grid-cols-3"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password<input type="password" required value={passwords.old_password} onChange={(event) => setPasswords({ ...passwords, old_password: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /></label><label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password<input type="password" required value={passwords.new_password} onChange={(event) => setPasswords({ ...passwords, new_password: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /></label><label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password<input type="password" required value={passwords.confirm_password} onChange={(event) => setPasswords({ ...passwords, confirm_password: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /></label><div className="md:col-span-3"><button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Updating..." : "Change Password"}</button></div></form></section>
  </div>;
}
