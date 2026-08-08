import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/user";

const emptyForm = { first_name: "", last_name: "", email: "", phone_number: "", country: "", state: "", city: "", address: "" };

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile().then((data) => {
      setProfile(data);
      setUser(data);
      setForm({ first_name: data.first_name || "", last_name: data.last_name || "", email: data.email || "", phone_number: data.phone_number || "", country: data.country || "", state: data.state || "", city: data.city || "", address: data.address || "" });
    }).catch((err) => setError(err.response?.data?.detail || "Failed to load profile.")).finally(() => setLoading(false));
  }, []);

  const updateField = (name: keyof typeof emptyForm, value: string) => setForm((previous) => ({ ...previous, [name]: value }));
  const fullName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || profile?.username || "User";
  const initials = fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage(""); setError("");
    try { const data = await updateProfile(form); setProfile(data); setUser(data); setEditing(false); setMessage("Profile updated successfully."); }
    catch (err: any) { setError(err.response?.data?.detail || "Failed to update profile."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm dark:bg-slate-900">Loading profile...</div>;

  return <div className="mx-auto max-w-5xl space-y-6"><div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profile</h1><p className="mt-1 text-sm text-slate-500">Manage your Wellora account information.</p></div>{error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}{message && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>}
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"><div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center dark:border-slate-800"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">{initials}</div><div><h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{fullName}</h2><p className="text-sm text-slate-500">{profile?.job_title || "Wellora User"}</p><p className="text-xs text-slate-400">Employee ID: {profile?.username || "-"}</p></div><button onClick={() => setEditing((value) => !value)} className="sm:ml-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{editing ? "Cancel" : "Edit Profile"}</button></div>
      {editing ? <form onSubmit={save} className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">{([["first_name", "First Name"], ["last_name", "Last Name"], ["email", "Email"], ["phone_number", "Phone"], ["country", "Country"], ["state", "State"], ["city", "City"]] as const).map(([key, label]) => <label key={key} className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}<input value={form[key]} onChange={(event) => updateField(key, event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /></label>)}<label className="text-sm font-medium text-slate-700 dark:text-slate-300 md:col-span-2">Address<textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /></label><div className="md:col-span-2"><button disabled={saving} className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button></div></form> : <div className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">{[["Full Name", fullName], ["Employee ID", profile?.username], ["Email", profile?.email], ["Phone", profile?.phone_number], ["Job Title", profile?.job_title], ["Company", profile?.company_name || profile?.company], ["Country", profile?.country], ["State", profile?.state], ["City", profile?.city], ["Address", profile?.address], ["Role", profile?.role]].map(([label, value]) => <div key={label}><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{value || "Not provided"}</p></div>)}</div>}
    </div>
  </div>;
}
