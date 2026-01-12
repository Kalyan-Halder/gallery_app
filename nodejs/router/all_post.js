const express = require("express")
const router = express.Router()
const user = require("../utils/user_schema");
const posts = require("../utils/post_schema")

router.route("/all_post").post(async (req, res) => {
    try {
        const allPosts = await posts.find({})
            .sort({ created_at: -1 })
            .lean();
        
        if (allPosts.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                posts: []
            });
        }

        //find the user who is watching the feed:
        const watching_user = await user.findOne({token:req.body.token})
        console.log(watching_user)
        
       
        const userIds = [...new Set(allPosts.map(post => post.user_id))];
        
        // Fetch all users who have posts - select the correct fields
        const users = await user.find({ _id: { $in: userIds } })
            .select('first_name last_name username avatar color avatarUrl')
            .lean();
        
        // Create a map for quick user lookup
        const userMap = {};
        users.forEach(u => {
            userMap[u._id.toString()] = u;
        });
        
        // Helper function to format timestamp
        const formatTimestamp = (date) => {
            if (!date) return "Recently";
            
            const now = new Date();
            const postDate = new Date(date);
            const diffMs = now - postDate;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffMins < 60) {
                return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            } else if (diffDays < 7) {
                return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
            } else {
                return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        };
        
        // Helper function to generate avatar from name
        const generateAvatar = (userData) => {
            if (userData.avatar && userData.avatar.trim() !== "") {
                return userData.avatar;
            }
            
            // Generate from first and last name
            let initials = "";
            if (userData.first_name && userData.first_name.length > 0) {
                initials += userData.first_name[0].toUpperCase();
            }
            if (userData.last_name && userData.last_name.length > 0) {
                initials += userData.last_name[0].toUpperCase();
            }
            
            // If no initials from name, use username
            if (initials === "" && userData.username) {
                initials = userData.username.substring(0, 2).toUpperCase();
            }
            
            return initials || "UU";
        };
        
        // Default color gradients
        const defaultColors = [
            "from-purple-500 to-pink-500",
            "from-blue-500 to-cyan-500",
            "from-green-500 to-emerald-500",
            "from-orange-500 to-yellow-500",
            "from-pink-500 to-rose-500",
            "from-indigo-500 to-blue-500"
        ];
        
        // Combine posts with user information
        const postsWithUser = allPosts.map(post => {
            const userData = userMap[post.user_id?.toString()] || {};
            
            // Generate display name
            let displayName = "Unknown User";
            if (userData.first_name || userData.last_name) {
                displayName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            } else if (userData.username) {
                displayName = userData.username;
            }
            
            // Generate username with @
            const username = userData.username ? `@${userData.username}` : "@unknown";
            
            // Generate avatar
            const avatar = generateAvatar(userData);
            
            // Get color or assign random one
            let color = userData.color || "from-gray-500 to-gray-700";
            if (color === "from-gray-500 to-gray-700") {
                // Assign a random color based on username hash for consistency
                const hash = userData.username ? 
                    userData.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
                color = defaultColors[hash % defaultColors.length];
            }
            
            return {
                id: post._id,
                user_id: post.user_id,
                watcher_avatar: watching_user?.avatarUrl || null,
                watcher_savedPosts: watching_user?.savedPost || ["something missing"],
                watcher_likedPosts: watching_user?.likedPost || ["something missing"],
                user: {
                    name: displayName,
                    username: username,
                    avatar: avatar,
                    color: color,
                    avatarUrl: userData.avatarUrl,
                },
                image: post.url || "",
                caption: post.description || "",
                likes: post.likes || 0,
                comments: post.comments || 0,
                shares: post.shares || 0,
                timestamp: formatTimestamp(post.created_at),
                location: post.location || "",
                tags: post.tags || []
            };
        });
        
        res.status(200).json({
            success: true,
            count: postsWithUser.length,
            posts: postsWithUser
        });
        
    } catch(err) {
        console.error("Error in /all_post:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: err.message
        });
    }
});

module.exports = router;