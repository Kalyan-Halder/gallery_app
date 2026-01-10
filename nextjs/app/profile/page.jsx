"use client";
import Add_Post from "./add_post";
import Edit_Profile_Photos from "./edit_profile";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react"; // Added useCallback
import {
  Trash,
  Plus,
  Camera,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Edit,
  Settings,
  LogOut,
  Grid,
  Bookmark,
  UserPlus,
  Users,
  MapPin,
  Calendar,
  Link as LinkIcon,
  MessageCirclePlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user_token, setToken] = useState(false);
  const [posts, setPosts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const router = useRouter();

  const [edit_toggle, setEditToggle] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

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

  // Create a fetchData function that can be called multiple times
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("token");
      setToken(token);

      // Fetch profile data
      const response = await fetch(`${BaseUrl}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      // Fetch posts data
      const postsResponse = await fetch(`${BaseUrl}/self_post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      const postsData = await postsResponse.json();

      if (!response.ok || !postsResponse.ok) {
        throw new Error(result?.message || `Error: ${response.status}`);
      } else {
        const initials =
          (result.first_name?.[0] ?? "") + (result.last_name?.[0] ?? "");
        setProfileData({
          name: `${result.first_name} ${result.last_name}`,
          username: `@${result.username}`,
          followers: result.followers,
          following: result.following,
          posts: result.posts,
          bio: result.bio,
          location: result.address,
          website: result.weblink,
          joinDate: `Joined ${result.dateStr}`,
          initial: initials,
          coverUrl: result.coverUrl,
          avatarUrl: result.avatarUrl,
        });

        setPosts(postsData.post || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggle_button = () => {
    setToggle(!toggle);
  };

  const edit_toggle_button = () => {
    setEditToggle(!edit_toggle);
  };

  const deletePost = async (postId) => {
    const token = localStorage.getItem("token");

    // optimistic UI remove (string-safe)
    setPosts((prev) => prev.filter((p) => String(p._id) !== String(postId)));
    setProfileData((prev) => ({
      ...prev,
      posts: Math.max(0, Number(prev.posts || 0) - 1),
    }));

    try {
      const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BaseUrl}/delete_post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, post_id: postId }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to delete post");
    } catch (e) {
      console.error(e);
      // rollback by refetching everything if delete failed
      fetchData();
    }
  };

  // Callback function to refresh data after adding a post
  const handlePostAdded = () => {
    fetchData(); // Refresh posts and profile data
  };

  // Callback function to refresh data after editing profile
  const handleProfileUpdated = () => {
    fetchData(); // Refresh profile data
  };

  const savedPosts = [
    {
      id: 7,
      likes: 567,
      comments: 42,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    },
    {
      id: 8,
      likes: 389,
      comments: 27,
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
    },
  ];

  const likedPosts = [
    {
      id: 9,
      likes: 654,
      comments: 56,
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
    },
    {
      id: 10,
      likes: 432,
      comments: 38,
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    },
  ];

  const renderPosts = () => {
    switch (activeTab) {
      case "posts":
        return posts;
      case "saved":
        return savedPosts;
      case "liked":
        return likedPosts;
      default:
        return posts;
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="h-auto bg-gray-200">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/30">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${profileData.coverUrl})` }}
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between">
              <div className="flex flex-col md:flex-row items-start md:items-center space-x-0 md:space-x-6">
                {/* Profile Picture */}
                <div className="relative mb-4 md:mb-0">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl border-4 border-white shadow-lg bg-linear-to-br from-blue-400 to-purple-500 overflow-hidden">
                    {/* Placeholder for profile image */}
                    <div className="h-full w-full flex items-center justify-center text-white text-5xl font-bold">
                      {!profileData.avatarUrl ? (
                        <span>{profileData.initial}</span>
                      ) : (
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{
                            backgroundImage: `url(${profileData.avatarUrl})`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <button
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    onClick={edit_toggle_button}
                  >
                    <Edit className="h-4 w-4 text-gray-700" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profileData.name}
                      </h1>
                      <p className="text-gray-600 mt-1">
                        {profileData.username}
                      </p>
                    </div>
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
                      <button
                        onClick={toggle_button}
                        className="p-2 border border-gray-300 rounded-full hover:pointer transition-colors hover:bg-blue-300"
                      >
                        <Plus className="h-5 w-5 text-gray-700" />
                      </button>
                      <div className="relative">
                        <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                          <MoreVertical className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bio and Info */}
                  <div className="space-y-3">
                    <p className="text-gray-700">{profileData.bio}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profileData.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <LinkIcon className="h-4 w-4" />
                        <a
                          href={profileData.website}
                          className="text-blue-600 hover:underline"
                        >
                          {profileData.website}
                        </a>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{profileData.joinDate}</span>
                      </div>
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

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                {
                  id: "posts",
                  icon: <Grid className="h-5 w-5" />,
                  label: "Posts",
                },
                {
                  id: "saved",
                  icon: <Bookmark className="h-5 w-5" />,
                  label: "Saved",
                },
                {
                  id: "liked",
                  icon: <Heart className="h-5 w-5" />,
                  label: "Liked",
                },
                {
                  id: "tagged",
                  icon: <Users className="h-5 w-5" />,
                  label: "Tagged",
                },
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

        {/* Photo Grid */}
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
                          <span className="font-semibold">{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-5 w-5" />
                          <span className="font-semibold">{post.comments}</span>
                        </div>
                      </div>
                      <div>
                        <div className="relative inline-block">
                          <button
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-red-600 m-1"
                            onClick={() => setConfirmDeleteId(post._id)}
                          >
                            <Trash />
                          </button>

                          {confirmDeleteId === post._id && (
                            <div className="fixed inset-0 z-9999 flex items-center justify-center">
                              <div
                                className="absolute inset-0 bg-black/40"
                                onClick={() => setConfirmDeleteId(null)}
                              />

                              <div className="relative z-10 w-[90%] max-w-sm rounded-xl bg-white shadow-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-800 mb-4">
                                  Delete this post? This can't be undone.
                                </p>

                                <div className="flex justify-end gap-2">
                                  <button
                                    className="px-3 py-1.5 text-sm text-black rounded-md bg-gray-100 hover:bg-gray-200"
                                    onClick={() => setConfirmDeleteId(null)}
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                                    onClick={() => {
                                      deletePost(post._id);
                                      setConfirmDeleteId(null);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-blue-500 m-1">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Posts Yet
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                {activeTab === "posts"
                  ? "Share your first photo and start your visual journey!"
                  : activeTab === "saved"
                  ? "Posts you save will appear here"
                  : "Posts you like will appear here"}
              </p>
            </div>
          )}
        </div>

        {/* Suggested Profiles */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Suggested Creators
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Sarah Miller",
                username: "@sarahshots",
                followers: "8.2K",
              },
              { name: "Mike Chen", username: "@mikewide", followers: "15.4K" },
              { name: "Lisa Park", username: "@lisalens", followers: "6.7K" },
              {
                name: "David Wilson",
                username: "@davidframe",
                followers: "21.3K",
              },
            ].map((creator, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {creator.name}
                    </h4>
                    <p className="text-sm text-gray-600">{creator.username}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {creator.followers} followers
                  </span>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals - Add these at the end of the return statement */}
      {toggle && (
        <Add_Post
          open={toggle}
          onClose={toggle_button}
          token={user_token}
          onSuccess={handlePostAdded} // Add this prop
        />
      )}
      {edit_toggle && (
        <Edit_Profile_Photos
          open={edit_toggle}
          onClose={edit_toggle_button}
          token={user_token}
          onSuccess={handleProfileUpdated} // Add this prop
        />
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Edit Profile
            </h3>
            {/* Add edit form here */}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 flex justify-around md:hidden">
        <button
          className={`p-3 rounded-full ${
            activeTab === "posts" ? "text-blue-600 bg-blue-50" : "text-gray-600"
          }`}
        >
          <Grid className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-full ${
            activeTab === "saved" ? "text-blue-600 bg-blue-50" : "text-gray-600"
          }`}
        >
          <Bookmark className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-full ${
            activeTab === "liked" ? "text-blue-600 bg-blue-50" : "text-gray-600"
          }`}
        >
          <Heart className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-full ${
            activeTab === "tagged"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-600"
          }`}
        >
          <Users className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Profile;
