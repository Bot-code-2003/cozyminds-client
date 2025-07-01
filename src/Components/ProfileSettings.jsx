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
  Users,
  MapPin,
  Award,
  BookOpen,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import Navbar from "./Dashboard/Navbar";
import { getWithExpiry, setWithExpiry, logout } from "../utils/anonymousName";
import { createAvatar } from '@dicebear/core';
import { avataaars, bottts, funEmoji, miniavs, croodles, micah, pixelArt, adventurer, bigEars, bigSmile, lorelei, openPeeps, personas, rings, shapes, thumbs } from '@dicebear/collection';
import { motion } from "framer-motion";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Map of avatar styles
const avatarStyles = {
  avataaars: avataaars,
  bottts: bottts,
  funEmoji: funEmoji,
  miniavs: miniavs,
  croodles: croodles,
  micah: micah,
  pixelArt: pixelArt,
  adventurer: adventurer,
  bigEars: bigEars,
  bigSmile: bigSmile,
  lorelei: lorelei,
  openPeeps: openPeeps,
  personas: personas,
  rings: rings,
  shapes: shapes,
  thumbs: thumbs,
};

// Helper for generating avatar SVG
const getAvatarSvg = (style, seed) => {
  const collection = avatarStyles[style] || avataaars;
  const svg = createAvatar(collection, { seed }).toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Helper to pick a deterministic random avatar style based on a seed (anonymousName)
const getDeterministicAvatarStyle = (seed) => {
  const styles = [
    'avataaars', 'bottts', 'funEmoji', 'miniavs', 'croodles', 'micah', 'pixelArt',
    'adventurer', 'bigEars', 'bigSmile', 'lorelei', 'openPeeps', 'personas',
    'rings', 'shapes', 'thumbs'
  ];
  if (!seed) return styles[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return styles[Math.abs(hash) % styles.length];
};

// When initializing DEFAULT_PROFILE_THEME, use the deterministic style if anonymousName is available
const getDefaultProfileTheme = (anonymousName) => ({
  type: 'color',
  value: '#b6e3f4',
  avatarStyle: getDeterministicAvatarStyle(anonymousName),
});

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
  const [activeSection, setActiveSection] = useState("profile"); // profile, security, publicCard
  const [editingCard, setEditingCard] = useState(false);
  const [profileTheme, setProfileTheme] = useState(getDefaultProfileTheme(form.anonymousName));
  const [savedCard, setSavedCard] = useState(getDefaultProfileTheme(form.anonymousName));

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getWithExpiry("user");
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
        if (user.profileTheme) {
          setProfileTheme(user.profileTheme);
          setSavedCard(user.profileTheme);
        } else {
          setProfileTheme(getDefaultProfileTheme(user.anonymousName));
          setSavedCard(getDefaultProfileTheme(user.anonymousName));
        }
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
      setWithExpiry("user", updated, 2 * 60 * 60 * 1000);
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
      logout();
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

  const handleSaveProfileCard = async () => {
    const updated = {
      ...userData,
      profileTheme,
    };
    await API.put(`/user/${userData._id}`, { profileTheme });
    setWithExpiry("user", updated, 2 * 60 * 60 * 1000);
    setUserData(updated);
    setSavedCard(profileTheme);
    setSuccess("Profile card updated!");
    setEditingCard(false);
  };

  const getBannerStyle = () => {
    if (profileTheme.type === 'color') return { background: profileTheme.value };
    if (profileTheme.type === 'gradient') return { background: profileTheme.value };
    if (profileTheme.type === 'texture') return { background: `url(${profileTheme.value})` };
    return {};
  };

  // Dummy stats for preview (replace with real stats if available)
  const previewStats = {
    subscriberCount: userData?.subscriberCount || 0,
    currentStreak: userData?.currentStreak || 0,
    journalCount: userData?.journalCount || userData?.journals?.length || 0,
    longestStreak: userData?.longestStreak || 0,
    bio: form.bio,
    anonymousName: form.anonymousName || userData?.anonymousName || "Anonymous",
    createdAt: userData?.createdAt || new Date().toISOString(),
  };

  // Public Profile Card Preview (simplified ProfileHeader)
  const PublicProfileCardPreview = () => (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-apple shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cover/Header Background */}
      <div
        className="h-32 relative"
        style={getBannerStyle()}
      >
        <div className="absolute inset-0 bg-black/20" />
        {/* Edit button: visible in top-right on desktop, below header on mobile */}
        <button
          className="hidden sm:block absolute bottom-2 right-2 px-4 py-1 bg-[var(--accent)] text-white rounded shadow hover:bg-[var(--accent-hover)]"
          onClick={() => {
            setSavedCard(profileTheme);
            setEditingCard(true);
          }}
        >Edit</button>
      </div>
      {/* Mobile Edit button below header */}
      {!editingCard && (
        <button
          className="block sm:hidden w-full mt-2 mb-4 px-4 py-3 bg-[var(--accent)] text-white rounded shadow hover:bg-[var(--accent-hover)] text-base font-semibold"
          onClick={() => {
            setSavedCard(profileTheme);
            setEditingCard(true);
          }}
        >Edit Public Profile Card</button>
      )}
      <div className="px-6 sm:px-8 pb-8">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
          {/* Avatar */}
          <motion.div
            className="w-32 h-32 rounded-apple flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-slate-800 flex-shrink-0 bg-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {/* Avatar SVG preview */}
            <img
              src={getAvatarSvg(profileTheme.avatarStyle || 'avataaars', form.anonymousName || userData?.anonymousName || 'Anonymous')}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Name and Info */}
          <div className="flex-1 min-w-0 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {previewStats.anonymousName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(previewStats.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Community Member</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bio */}
        {previewStats.bio && (
          <motion.div
            className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {previewStats.bio}
            </p>
          </motion.div>
        )}
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Followers</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {previewStats.subscriberCount}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {previewStats.currentStreak}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">days</span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Journals</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {previewStats.journalCount}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {previewStats.longestStreak}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">days</span>
            </p>
          </div>
        </motion.div>
        {/* Edit controls */}
        {editingCard && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Customize Your Public Profile Card</h2>
            {/* Avatar Style Selection */}
            <div className="mb-4 flex flex-col gap-2">
              <label className="block font-medium mb-1">Avatar Style</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(avatarStyles).map((style) => (
                  <button
                    key={style}
                    className={`px-3 py-1 rounded ${profileTheme.avatarStyle === style ? 'bg-[var(--accent)] text-white' : 'bg-gray-200'}`}
                    onClick={() => setProfileTheme({ ...profileTheme, avatarStyle: style })}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            {/* Banner Selection */}
            <div className="mb-4 flex flex-col gap-2">
              <label className="block font-medium mb-1">Banner Style</label>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${profileTheme.type === 'color' ? 'bg-[var(--accent)] text-white' : 'bg-gray-200'}`}
                  onClick={() => setProfileTheme({ ...profileTheme, type: 'color', value: profileTheme.type === 'color' ? profileTheme.value : '#b6e3f4' })}
                >Color</button>
                <button
                  className={`px-3 py-1 rounded ${profileTheme.type === 'gradient' ? 'bg-[var(--accent)] text-white' : 'bg-gray-200'}`}
                  onClick={() => setProfileTheme({ ...profileTheme, type: 'gradient', value: profileTheme.type === 'gradient' ? profileTheme.value : 'linear-gradient(90deg, #b6e3f4 0%, #fbc2eb 100%)' })}
                >Gradient</button>
                <button
                  className={`px-3 py-1 rounded ${profileTheme.type === 'texture' ? 'bg-[var(--accent)] text-white' : 'bg-gray-200'}`}
                  onClick={() => setProfileTheme({ ...profileTheme, type: 'texture', value: profileTheme.type === 'texture' ? profileTheme.value : '' })}
                >Texture</button>
              </div>
              {profileTheme.type === 'color' && (
                <input
                  type="color"
                  value={profileTheme.value}
                  onChange={e => setProfileTheme({ ...profileTheme, type: 'color', value: e.target.value })}
                  className="w-16 h-10 border rounded mt-2"
                  style={{ cursor: 'pointer' }}
                />
              )}
              {profileTheme.type === 'gradient' && (
                <input
                  type="text"
                  value={profileTheme.value}
                  onChange={e => setProfileTheme({ ...profileTheme, type: 'gradient', value: e.target.value })}
                  className="w-full border rounded p-2 mt-2"
                  placeholder="CSS gradient value"
                />
              )}
              {profileTheme.type === 'texture' && (
                <input
                  type="text"
                  value={profileTheme.value}
                  onChange={e => setProfileTheme({ ...profileTheme, type: 'texture', value: e.target.value })}
                  className="w-full border rounded p-2 mt-2"
                  placeholder="Image URL for texture"
                />
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveProfileCard}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-hover)]"
              >Save</button>
              <button
                onClick={() => { setProfileTheme(savedCard); setEditingCard(false); }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >Cancel</button>
            </div>
            {success && <div className="text-green-600 mt-2">{success}</div>}
          </div>
        )}
      </div>
    </motion.div>
  );

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
            { id: "publicCard", label: "Public Profile Card", icon: Users },
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
          {activeSection === "publicCard" && <PublicProfileCardPreview />}
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
