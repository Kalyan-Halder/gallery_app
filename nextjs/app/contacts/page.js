"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, Globe, MessageSquare, CheckCircle, Instagram, Twitter, Facebook } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      info: "demolink5355@gmail.com",
      subinfo: "We'll reply within 24 hours",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      info: "+880188*******",
      subinfo: "Mon-Fri, 9AM-6PM EST",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      info: "Barishal, Bangladesh",
      subinfo: "By appointment only",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Response Time",
      info: "Within 24 hours",
      subinfo: "For all inquiries",
      color: "from-orange-500 to-yellow-500"
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="h-auto from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-3xl mb-6">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions, feedback, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards & Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {contactInfo.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className={`inline-flex p-3 rounded-xl bg-linear-to-r ${item.color} mb-4`}>
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-800 font-medium mb-1">{item.info}</p>
                  <p className="text-sm text-gray-500">{item.subinfo}</p>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-400 mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="group">
                  <div className="p-3 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Facebook className="h-6 w-6 text-white" />
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="p-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="p-3 bg-linear-to-r from-sky-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Twitter className="h-6 w-6 text-white" />
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="p-3 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
            <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                <p className="text-gray-600 mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Visit Our Headquarters</h3>
            <p className="text-blue-100 mb-6">123 Creative Street, San Francisco, CA 94107</p>
            <div className="aspect-video bg-linear-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
              {/* Map Placeholder - In a real app, you'd embed Google Maps here */}
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">Interactive Map</p>
                  <p className="text-gray-400 text-sm mt-2">Google Maps integration ( Will be added later)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Quick answers to common questions. Can't find what you're looking for? 
            <a href="#" className="text-blue-600 font-semibold ml-1 hover:underline">Visit our help center →</a>
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              "How do I reset my password?",
              "Can I delete my account?",
              "Is there a mobile app?",
              "How do I report inappropriate content?",
              "What are the community guidelines?",
              "How do I become a verified creator?"
            ].map((question, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer group">
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {question}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Shutter Sphere. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              support@shuttersphere.com • +1 (555) 123-4567
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;