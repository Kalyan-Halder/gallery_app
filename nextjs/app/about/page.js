"use client";
import { useState } from "react";
import { Camera, Users, Heart, Share2, Globe, Shield, Sparkles } from "lucide-react";

const About = () => {
  const [activeTab, setActiveTab] = useState("story");

  const features = [
    {
      icon: <Camera className="h-10 w-10" />,
      title: "Visual Storytelling",
      description: "Share your moments through captivating images and meaningful captions.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Global Community",
      description: "Connect with photographers and visual artists from around the world.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Interactive Engagement",
      description: "Like, comment, and share your appreciation for beautiful content.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Share2 className="h-10 w-10" />,
      title: "Easy Sharing",
      description: "Seamlessly share your images across multiple platforms.",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "Worldwide Reach",
      description: "Discover content from every corner of the globe.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Safe Space",
      description: "A respectful community with robust content moderation.",
      color: "from-emerald-500 to-green-500"
    }
  ];

  const stats = [
    { number: "1M+", label: "Active Users" },
    { number: "10M+", label: "Photos Shared" },
    { number: "200+", label: "Countries" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="h-auto bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Shutter Sphere
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Where every picture tells a story, and every story finds its audience
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A global community for photographers, artists, and visual storytellers to share their perspectives, connect with like-minded individuals, and inspire creativity worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Shutter Sphere?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We've built a platform that puts creativity, community, and connection at the forefront
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl" />
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-r ${feature.color} mb-6`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap md:flex-nowrap">
              {["story", "mission", "vision", "values"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-lg font-medium transition-all ${
                    activeTab === tab
                      ? "bg-linear-to-r from-blue-500 to-purple-500 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-8 md:p-12">
            {activeTab === "story" && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">Our Story</h3>
                <p className="text-gray-700 text-lg">
                  Founded in 2023, Shutter Sphere began as a simple idea: to create a space where visual stories could be shared without algorithms dictating what gets seen. We believe every perspective matters, and every image has a story worth telling.
                </p>
                <p className="text-gray-700 text-lg">
                  What started as a small community of photography enthusiasts has grown into a global platform where millions come to share, discover, and connect through the universal language of visuals.
                </p>
              </div>
            )}
            
            {activeTab === "mission" && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
                <p className="text-gray-700 text-lg">
                  To democratize visual storytelling by providing a platform where creativity thrives, communities connect, and diverse perspectives are celebrated. We're committed to making visual expression accessible to everyone, everywhere.
                </p>
              </div>
            )}
            
            {activeTab === "vision" && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
                <p className="text-gray-700 text-lg">
                  We envision a world where visual communication bridges cultural divides, where every person has a platform to share their unique viewpoint, and where creativity is recognized as a fundamental form of human connection.
                </p>
              </div>
            )}
            
            {activeTab === "values" && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">Our Values</h3>
                <ul className="space-y-4 text-gray-700 text-lg">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Authenticity:</strong> Real stories from real people</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span><strong>Creativity:</strong> Encouraging artistic expression</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span><strong>Community:</strong> Building meaningful connections</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span><strong>Innovation:</strong> Continuously improving the experience</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join Our Visual Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ready to share your perspective with the world? Join millions of creators on Shutter Sphere today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors transform hover:scale-105">
              Get Started Free
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
              Explore Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Shutter Sphere
              </div>
              <p className="text-gray-400 mt-2">Visual Stories, Global Connections</p>
            </div>
            <div className="text-gray-400">
              <p>&copy; {new Date().getFullYear()} Shutter Sphere. All rights reserved.</p>
              <p className="mt-2">Made with care for the creative community</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;