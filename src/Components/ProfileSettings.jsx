"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Save,
  Trash2,
  Check,
  X,
  Lock,
  User,
  Mail,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";

const ProfileSettings = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode } = useDarkMode();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    age: "",
    gender: "",
    subscribe: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        if (!user) return navigate("/login");
        setUserData(user);
        setForm({
          nickname: user.nickname || "",
          email: user.email || "",
          age: user.age || "",
          gender: user.gender || "",
          subscribe: user.subscribe || false,
        });
      } catch (e) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Auto-clear messages after 5 seconds
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [navigate, error, success]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = {
        ...userData,
        ...form,
        age: form.age ? parseInt(form.age) : null,
      };
      await API.put(`/user/${userData.id}`, updated);
      sessionStorage.setItem("user", JSON.stringify(updated));
      setUserData(updated);
      setSuccess("Profile updated successfully");
      setEditing(false);
    } catch (e) {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePwdChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (passwords.new !== passwords.confirm) {
      setSaving(false);
      return setError("Passwords do not match");
    }
    try {
      const res = await API.post("/verify-password", {
        userId: userData.id,
        password: passwords.current,
      });
      if (!res.data.valid) {
        setSaving(false);
        return setError("Incorrect current password");
      }
      await API.put(`/user/${userData.id}/password`, {
        newPassword: passwords.new,
      });
      setSuccess("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
      setChangingPwd(false);
    } catch (e) {
      setError("Password update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/user/${userData.id}`);
      sessionStorage.removeItem("user");
      setSuccess("Account deleted successfully");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Delete failed");
    }
  };

  const cancelEditing = () => {
    // Reset form to original values
    if (userData) {
      setForm({
        nickname: userData.nickname || "",
        email: userData.email || "",
        age: userData.age || "",
        gender: userData.gender || "",
        subscribe: userData.subscribe || false,
      });
    }
    setEditing(false);
  };

  const cancelPasswordChange = () => {
    setPasswords({ current: "", new: "", confirm: "" });
    setChangingPwd(false);
  };

  return (
    <div
      className="min-h-screen px-6 py-12 max-w-7xl mx-auto font-sans space-y-12"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <header className="flex flex-col gap-1 border-b border-[var(--accent)] pb-4">
        <div className="flex items-center mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[var(--accent)] hover:underline mr-4"
          >
            <ChevronLeft size={18} className="mr-1" /> Back
          </button>
          <h1 className="text-4xl font-bold leading-tight">Profile Settings</h1>
        </div>
        <p className="text-secondary">
          Welcome back, {userData?.nickname || "User"}! Manage your profile and
          account settings.
        </p>
      </header>

      {(error || success) && (
        <div
          className={`p-4 flex justify-between items-center ${
            error
              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-l-4 border-red-500"
              : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-l-4 border-green-500"
          }`}
          style={{ borderRadius: "0" }}
        >
          <div className="flex items-center">
            {error ? (
              <X size={18} className="mr-2 text-red-500" />
            ) : (
              <Check size={18} className="mr-2 text-green-500" />
            )}
            <span>{error || success}</span>
          </div>
          <button
            onClick={() => (error ? setError(null) : setSuccess(null))}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-t-[var(--accent)] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="mt-4 text-accent">Loading your profile...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section
            className="p-6 space-y-6 col-span-1 border border-[var(--accent)]"
            style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
          >
            <h2 className="text-2xl font-bold border-b pb-2">
              Profile Information
            </h2>
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Nickname</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Nickname"
                      value={form.nickname}
                      onChange={(e) =>
                        setForm({ ...form, nickname: e.target.value })
                      }
                      className="w-full p-2 pl-10 border border-designer shadow-elegant"
                      style={{ borderRadius: "0" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full p-2 pl-10 border border-designer shadow-elegant"
                      style={{ borderRadius: "0" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="number"
                      placeholder="Age"
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: e.target.value })
                      }
                      className="w-full p-2 pl-10 border border-designer shadow-elegant"
                      style={{ borderRadius: "0" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full p-2 border border-designer shadow-elegant"
                    style={{ borderRadius: "0" }}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="subscribe"
                    checked={form.subscribe}
                    onChange={(e) =>
                      setForm({ ...form, subscribe: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="subscribe" className="text-sm">
                    Subscribe to newsletter and updates
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={saving}
                    className="px-4 py-2 bg-[var(--accent)] text-white flex items-center"
                    style={{ borderRadius: "0" }}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-4 py-2 border border-gray-300 flex items-center"
                    style={{ borderRadius: "0" }}
                  >
                    <X size={16} className="mr-2" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-y-3 border-b pb-4">
                  <div className="text-sm text-gray-500">Nickname:</div>
                  <div className="font-medium">
                    {form.nickname || "Not set"}
                  </div>

                  <div className="text-sm text-gray-500">Email:</div>
                  <div className="font-medium">{form.email || "Not set"}</div>

                  <div className="text-sm text-gray-500">Age:</div>
                  <div className="font-medium">{form.age || "Not set"}</div>

                  <div className="text-sm text-gray-500">Gender:</div>
                  <div className="font-medium">
                    {form.gender
                      ? form.gender.charAt(0).toUpperCase() +
                        form.gender.slice(1)
                      : "Not set"}
                  </div>

                  <div className="text-sm text-gray-500">Newsletter:</div>
                  <div className="font-medium">
                    {form.subscribe ? "Subscribed" : "Not subscribed"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-[var(--accent)] text-white flex items-center"
                  style={{ borderRadius: "0" }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </section>

          <section
            className="p-6 space-y-6 col-span-1 border border-[var(--accent)]"
            style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
          >
            <h2 className="text-2xl font-bold border-b pb-2">
              Security Settings
            </h2>
            {changingPwd ? (
              <form onSubmit={handlePwdChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    className="w-full p-2 border border-designer shadow-elegant"
                    style={{ borderRadius: "0" }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    className="w-full p-2 border border-designer shadow-elegant"
                    style={{ borderRadius: "0" }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    className="w-full p-2 border border-designer shadow-elegant"
                    style={{ borderRadius: "0" }}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-[var(--accent)] text-white flex items-center"
                    style={{ borderRadius: "0" }}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin mr-2"></div>
                        Changing...
                      </>
                    ) : (
                      <>
                        <Lock size={16} className="mr-2" /> Change Password
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelPasswordChange}
                    className="px-4 py-2 border border-gray-300 flex items-center"
                    style={{ borderRadius: "0" }}
                  >
                    <X size={16} className="mr-2" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setChangingPwd(true)}
                className="px-4 py-2 bg-[var(--accent)] text-white flex items-center"
                style={{ borderRadius: "0" }}
              >
                <Lock size={16} className="mr-2" /> Change Password
              </button>
            )}

            <div className="pt-6 mt-6 border-t">
              <h3 className="text-lg font-semibold mb-4 text-red-600">
                Danger Zone
              </h3>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-white text-red-500 border border-red-500 flex items-center hover:bg-red-50"
                  style={{ borderRadius: "0" }}
                >
                  <Trash2 size={18} className="mr-2" /> Delete Account
                </button>
              ) : (
                <div
                  className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20"
                  style={{ borderRadius: "0" }}
                >
                  <p className="text-sm mb-3 text-red-800 dark:text-red-300">
                    Are you sure you want to delete your account? This action
                    cannot be undone and all your data will be permanently
                    removed.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
                      style={{ borderRadius: "0" }}
                    >
                      <Trash2 size={16} className="mr-2 inline-block" /> Yes,
                      Delete My Account
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                      style={{ borderRadius: "0" }}
                    >
                      <X size={16} className="mr-2 inline-block" /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
