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
  Eye,
  EyeOff,
  Shield,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import Navbar from "./Dashboard/Navbar";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const ProfileSettings = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    age: "",
    gender: "",
    bio: "",
    anonymousName: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState("profile"); // profile, security

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
          bio: user.bio || "",
          anonymousName: user.anonymousName || "",
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
        age: form.age ? Number.parseInt(form.age) : null,
      };

      await API.put(`/user/${userData._id}`, updated);
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
        userId: userData._id,
        password: passwords.current,
      });
      if (!res.data.valid) {
        setSaving(false);
        return setError("Incorrect current password");
      }
      await API.put(`/user/${userData._id}/password`, {
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
      await API.delete(`/user/${userData._id}`);
      sessionStorage.removeItem("user");
      setSuccess("Account deleted successfully");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Delete failed");
    }
  };

  const cancelEditing = () => {
    if (userData) {
      setForm({
        nickname: userData.nickname || "",
        email: userData.email || "",
        age: userData.age || "",
        gender: userData.gender || "",
        bio: userData.bio || "",
        anonymousName: userData.anonymousName || "",
      });
    }
    setEditing(false);
  };

  const cancelPasswordChange = () => {
    setPasswords({ current: "", new: "", confirm: "" });
    setShowPasswords({ current: false, new: false, confirm: false });
    setChangingPwd(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderProfileSection = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
          Display Name
        </label>
        <input
          type="text"
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          placeholder="Enter your display name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
          Anonymous Name
        </label>
        <input
          type="text"
          value={form.anonymousName}
          onChange={(e) => setForm({ ...form, anonymousName: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          placeholder="Enter your anonymous name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
          Bio
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 min-h-[80px] sm:min-h-[100px] resize-y text-sm sm:text-base"
          placeholder="Tell us about yourself"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          placeholder="Enter your email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
            Age
          </label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            placeholder="Enter your age"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
            Gender
          </label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.current ? "text" : "password"}
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("current")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPasswords.current ? (
              <EyeOff size={16} className="sm:w-5 sm:h-5" />
            ) : (
              <Eye size={16} className="sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.new ? "text" : "password"}
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("new")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPasswords.new ? (
              <EyeOff size={16} className="sm:w-5 sm:h-5" />
            ) : (
              <Eye size={16} className="sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1 sm:mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirm ? "text" : "password"}
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-apple border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E68A41] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            placeholder="Confirm new password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirm")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPasswords.confirm ? (
              <EyeOff size={16} className="sm:w-5 sm:h-5" />
            ) : (
              <Eye size={16} className="sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={cancelPasswordChange}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-[var(--border)] rounded-apple text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          onClick={handlePwdChange}
          disabled={saving}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#E68A41] text-white rounded-apple hover:bg-[#D67A31] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {saving ? "Saving..." : "Change Password"}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E68A41] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
            Profile Settings
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Alert Messages */}
        {(error || success) && (
          <div
            className={`mb-6 sm:mb-8 p-3 sm:p-4 rounded-apple border-2 flex justify-between items-center ${
              error
                ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-500"
                : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-500"
            }`}
          >
            <div className="flex items-center">
              {error ? (
                <X size={16} className="mr-2 sm:mr-3 text-red-500" />
              ) : (
                <Check size={16} className="mr-2 sm:mr-3 text-green-500" />
              )}
              <span className="text-sm sm:text-base font-medium">{error || success}</span>
            </div>
            <button
              onClick={() => (error ? setError(null) : setSuccess(null))}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-2 sm:space-x-4 mb-6 sm:mb-8 border-b border-[var(--border)] overflow-x-auto pb-2">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "security", label: "Security", icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeSection === tab.id
                  ? "border-[#E68A41] text-[#E68A41]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <tab.icon size={16} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-[var(--bg-secondary)] rounded-apple p-4 sm:p-6 shadow-apple">
          {activeSection === "profile" && renderProfileSection()}
          {activeSection === "security" && renderSecuritySection()}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200 text-sm sm:text-base"
          >
            <Trash2 size={16} className="sm:w-5 sm:h-5" />
            Delete Account
          </button>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={cancelEditing}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-[var(--border)] rounded-apple text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#E68A41] text-white rounded-apple hover:bg-[#D67A31] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-apple p-4 sm:p-6 max-w-md w-full mx-4">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
              Delete Account
            </h3>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-4 sm:mb-6">
              Are you sure you want to delete your account? This action cannot be
              undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-[var(--border)] rounded-apple text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-500 text-white rounded-apple hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
