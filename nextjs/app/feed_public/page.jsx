"use client";
import { useState, useEffect } from "react";
import {MapMinus, Heart, MessageCircle, Send, Bookmark, MoreVertical, Share2, Camera, Filter, Search } from "lucide-react";
<MapMinus />
const Feeds = () => {
  const [activeFilter, setActiveFilter] = useState("following");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());

  const [toggle, setToggle] = useState(false)
  const [user_token, setToken] = useState(false)
  const toggle_button = ()=>{
      console.log(toggle)
      setToggle(!toggle)
  }

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try{
         const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL
         const response = await fetch(`${BaseUrl}/all_post`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });

          const result = await response.json();
          console.log("API Response:", result);
          
          if (!response.ok) {
             throw new Error(result?.message || `Error: ${response.status}`);
          } else {
             // Check if data is in the expected format
             const fetchedPosts = result.posts || result.data || result;
             console.log("Fetched posts:", fetchedPosts);
             
             // Set posts directly from the API response
             setPosts(fetchedPosts);
             setLoading(false);
          }
          const token = localStorage.getItem("token");
          setToken(token)
          
          
      } catch(err) {
          console.log("Error fetching posts:", err);
          // Optionally, you can set some mock data if API fails
          setPosts([]);
          setLoading(false);
      }
    }
   
    fetchData();
  }, []);

  // Debug: Log posts whenever it changes
  useEffect(() => {
    console.log("Posts state updated:", posts);
  }, [posts]);

  const handleLike = async (postId) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
      // Decrease like count
      setPosts(posts.map(post => 
        post.id === postId ? {...post, likes: post.likes - 1} : post
      ));
    } else {
      newLiked.add(postId);
      // Increase like count
      setPosts(posts.map(post => 
        post.id === postId ? {...post, likes: post.likes + 1} : post
      ));
    }
    setLikedPosts(newLiked);
  };

  const handleSave = async (postId) => {
     console.log(postId)
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`https://shuttersphere.com/post/${postId}`);
    // You could add a toast notification here
    alert("Link copied to clipboard!");
  };

  const filters = [
    { id: "following", label: "Following" },
    { id: "popular", label: "Popular" },
    { id: "new", label: "New" },
    { id: "trending", label: "Trending" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-200">
       

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Card */}
         
        {toggle && (<Add_Post open={toggle} onClose={toggle_button} token={user_token} />)}
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? "bg-linear-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
          <button className="p-2 bg-white rounded-full text-gray-600 hover:bg-gray-100">
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Post Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full bg-linear-to-r ${post.user?.color || "from-gray-500 to-gray-700"} flex items-center justify-center text-white font-semibold`}>
                        {post.user?.avatar || "UU"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{post.user?.name || "Unknown User"}</div>
                        <div className="text-sm text-gray-600">{post.user?.username || "@unknown"}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.location && (
                        <span className="text-sm text-gray-500 flex gap-2 justify-baseline align-middle">{post.location} <MapMinus color="blue"  ></MapMinus></span>
                      )}
                       
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                <div className="relative">
                  <div 
                    className="h-96 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                   
                </div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLike(post.id || post._id)}
                        className="flex items-center space-x-1"
                      >
                        <Heart className={`h-6 w-6 ${likedPosts.has(post.id || post._id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
                        <span className="font-medium text-gray-900">{(post.likes || 0).toLocaleString()}</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <MessageCircle className="h-6 w-6 text-gray-700" />
                        <span className="font-medium text-gray-900">{post.comments || 0}</span>
                      </button>
                      <button 
                        onClick={() => handleShare(post.id || post._id)}
                        className="flex items-center space-x-1"
                      >
                        <Share2 className="h-6 w-6 text-gray-700" />
                        <span className="font-medium text-gray-900">{post.shares || 0}</span>
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">{post.timestamp || "Recently"}</span>
                  </div>

                  {/* Caption */}
                  <div className="mb-4">
                    <p className="text-gray-800">
                      <span className="font-semibold text-gray-900">{post.user?.username || "@unknown"}</span> {post.caption || ""}
                    </p>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Be the first to share your moments!</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center py-8">
            <button className="px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors">
              Load More Posts
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <button className="fixed bottom-6 right-6 md:hidden p-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
        <Camera className="h-6 w-6" />
      </button>

      {/* Suggested Users Sidebar (Desktop) */}
      <div className="hidden lg:block fixed right-8 top-24 w-72">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Suggested for You</h3>
          <div className="space-y-3">
            {[
              { name: "Travel Lens", followers: "45K", color: "from-blue-400 to-cyan-400" },
              { name: "Urban Shots", followers: "32K", color: "from-purple-400 to-pink-400" },
              { name: "Nature Focus", followers: "67K", color: "from-green-400 to-emerald-400" }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full bg-linear-to-r ${user.color}`} />
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.followers} followers</div>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["#photography", "#landscape", "#portrait", "#streetphotography", "#nature", "#travel"].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feeds;