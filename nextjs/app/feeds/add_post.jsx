"use client";
import { useState } from "react";

const Add_Post = ({ open = false, onClose = () => {}, token = "" }) => {
  const [formData, setFormData] = useState({
    token:"",
    description: "",
    location: "",
    tags: "", // comma separated string
  });
  const [file, setFile] = useState(null); // ✅ file state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(" ");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setSuccess(false);
    setError(" ");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSuccess(false);
    setError(" ");
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(" ");
    setSuccess(false);

    if (!formData.description || !formData.tags) {
      setError("user_id, and description are required");
      return;
    }

  
    const tagsArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    try {
      setLoading(true);

      //Use multipart/form-data for file upload
      const fd = new FormData();
      fd.append("token", token);
      fd.append("description", formData.description);
      fd.append("location", formData.location);
      fd.append("tags", JSON.stringify(tagsArray)); // send as JSON string

      if (file) {
        fd.append("file", file); // key name "file" (backend should match)
      }
      const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const response = await fetch(`${BaseUrl}/create_post`, {
        method: "POST",
        body: fd,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || `Error: ${response.status}`);
        return;
      }

      setSuccess(true);
      setError("Post created!");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError(err?.message || "Something went wrong");
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
            Create a Post
          </h1>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full  bg-black hover:bg-red-500"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
           

          <textarea
            name="description"
            placeholder="Caption"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            name="location"
            type="text"
            placeholder="Location (optional)"
            value={formData.location}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            name="tags"
            type="text"
            placeholder="Tags (comma separated) e.g. travel, food"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          {/* ✅ File upload */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Upload file (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-black file:mr-3 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
            />
            {file && (
              <p className="text-xs text-gray-600">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {error && (
            <p className={`text-sm ${success ? "text-green-600" : "text-red-600"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add_Post;
