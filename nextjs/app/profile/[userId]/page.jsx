"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Grid,
  Users,
  MapPin,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId; // from /profile/[userId]

  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    joinDate: "",
    followers: "",
    following: "",
    posts: "",
    initial: "",
    coverUrl: "",
    avatarUrl: "",
  });

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("token");

      const profileRes = await fetch(`${BaseUrl}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, user_id: userId }),
      });

      const postsRes = await fetch(`${BaseUrl}/self_post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, user_id: userId }),
      });

      const profileJson = await profileRes.json();
      const postsJson = await postsRes.json();

      if (!profileRes.ok) {
        throw new Error(profileJson?.message || "Failed to load profile");
      }
      if (!postsRes.ok) {
        throw new Error(postsJson?.message || "Failed to load posts");
      }

      const initials =
        (profileJson.first_name?.[0] ?? "") + (profileJson.last_name?.[0] ?? "");

      setProfileData({
        name: `${profileJson.first_name || ""} ${profileJson.last_name || ""}`.trim(),
        username: profileJson.username ? `@${profileJson.username}` : "",
        followers: profileJson.followers ?? "",
        following: profileJson.following ?? "",
        posts: profileJson.posts ?? "",
        bio: profileJson.bio ?? "",
        location: profileJson.address ?? "",
        website: profileJson.weblink ?? "",
        joinDate: profileJson.dateStr ? `Joined ${profileJson.dateStr}` : "",
        initial: initials,
        coverUrl: profileJson.coverUrl ?? "",
        avatarUrl: profileJson.avatarUrl ?? "",
      });
      setPosts(postsJson.post || []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderPosts = () => posts;

  const handleFollow = () => {
    setIsFollowing((v) => !v);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="bg-white px-6 py-4 text-black rounded-xl shadow">Loading profile…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full">
          <div className="text-lg font-semibold text-gray-900 mb-2">Couldn’t load profile</div>
          <div className="text-sm text-gray-700 mb-4">{error}</div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={() => router.back()}
            >
              Go back
            </button>
            <button
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={fetchData}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto bg-gray-200">
      {/* Cover Photo */}
      <div className="relative h-84 md:h-100 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/30">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundImage: profileData.coverUrl
                ? `url(${profileData.coverUrl})`
                : "none",
            }}
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 md:p-8">
            <div className="flex w-full md:flex-row md:items-start justify-between">
              <div className="flex w-full flex-col md:flex-row items-start md:items-center space-x-0 md:space-x-6">
                {/* Profile Picture (no edit button in public view) */}
                <div className="relative mb-4 md:mb-0">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl border-4 border-white shadow-lg bg-linear-to-br from-blue-400 to-purple-500 overflow-hidden">
                    <div className="h-full w-full flex items-center justify-center text-white text-5xl font-bold">
                      {!profileData.avatarUrl ? (
                        <span>{profileData.initial}</span>
                      ) : (
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${profileData.avatarUrl})` }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profileData.name || "User"}
                      </h1>
                      {profileData.username && (
                        <p className="text-gray-600 mt-1">{profileData.username}</p>
                      )}
                    </div>

                    {/* Public actions: follow + message + menu (no add/delete/edit) */}
                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <button
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                          isFollowing
                            ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                            : "bg-linear-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>

                      <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                        <MessageCircle className="h-5 w-5 text-gray-700" />
                      </button>

                      <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                        <MoreVertical className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Bio and Info */}
                  <div className="space-y-3">
                    {profileData.bio && <p className="text-gray-700">{profileData.bio}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {profileData.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{profileData.location}</span>
                        </div>
                      )}

                      {profileData.website && (
                        <div className="flex items-center space-x-1">
                          <LinkIcon className="h-4 w-4" />
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profileData.website}
                          </a>
                        </div>
                      )}

                      {profileData.joinDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{profileData.joinDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex space-x-6 pt-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.posts}
                        </div>
                        <div className="text-sm text-gray-600">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.followers}
                        </div>
                        <div className="text-sm text-gray-600">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.following}
                        </div>
                        <div className="text-sm text-gray-600">Following</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs (public view: only Posts / Tagged) */}
          <div className="border-t border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: "posts", icon: <Grid className="h-5 w-5" />, label: "Posts" },
                { id: "tagged", icon: <Users className="h-5 w-5" />, label: "Tagged" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Post Grid */}
        <div className="mt-8">
          {renderPosts().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderPosts().map((post) => (
                <div
                  key={post._id}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${post.url})` }}
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-5 w-5" />
                          <span className="font-semibold">
                            {(post.likes || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-5 w-5" />
                          <span className="font-semibold">
                            {(post.comments || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* No delete button in public view */}
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-blue-500 m-1">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Grid className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                This user hasn’t shared any posts yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
