"use client";

import { useState } from "react";

const Edit_Profile_Photos = ({ open = false, onClose = () => {}, token = "", onSuccess = () => {} }) => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(" "); // reuse like your error state
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e) => {
    setSuccess(false);
    setMessage(" ");
    const selected = e.target.files?.[0] || null;
    setAvatarFile(selected);
  };

  const handleCoverChange = (e) => {
    setSuccess(false);
    setMessage(" ");
    const selected = e.target.files?.[0] || null;
    setCoverFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setMessage(" ");

    // Require at least one file
    if (!avatarFile && !coverFile) {
      setMessage("Please select an avatar photo or a cover photo (or both).");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("token", token);

      // Key names must match what your backend expects.
      // If your backend expects different names, change these two keys:
      if (avatarFile) fd.append("avatar", avatarFile);
      if (coverFile) fd.append("cover", coverFile);
      const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const response = await fetch(`${BaseUrl}/edit_profile`, {
        method: "POST",
        body: fd,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data?.message || `Error: ${response.status}`);
        setSuccess(false);
        return;
      }

      setSuccess(true);
      setMessage(data?.message || "Profile updated!");
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setSuccess(false);
      setMessage(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Profile Photos
          </h1>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black hover:bg-red-500 text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar upload */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Avatar photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full text-sm text-black file:mr-3 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
            />
            {avatarFile && (
              <p className="text-xs text-gray-600">
                Selected: <span className="font-medium">{avatarFile.name}</span>
              </p>
            )}
          </div>

          {/* Cover upload */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Cover photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="w-full text-sm text-black file:mr-3 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
            />
            {coverFile && (
              <p className="text-xs text-gray-600">
                Selected: <span className="font-medium">{coverFile.name}</span>
              </p>
            )}
          </div>

          {message && (
            <p className={`text-sm ${success ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit_Profile_Photos;
