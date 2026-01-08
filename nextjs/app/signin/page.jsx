"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
const Signin = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(" ");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if(!formData.username || !formData.email || !formData.password){
      setError("All field Must be fullfilled")
      return
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if(response.status == 400){
        setFormData({
          email:"",
          username:"",
          password:""
        })
        setError(data.message)
      }
      else if (response.status == 200){
        console.log("Its a success")
        localStorage.setItem('token', data.token)
        window.dispatchEvent(new Event('tokenChange'));
        setTimeout(() => {
        router.push("/feeds");
        },500);
      }else if (response.status == 401){
        setError("User is Not Verified. Needs Verification")
        setTimeout(() => {
        router.push("/verify");
        },1500);
      }
    } catch (err) {
       
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Sign in
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Stay Updated 
        </p>

         
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Forgot password */}
          <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
            <Link href="/reset">
                 Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          New to Shutter Sphere?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            <Link href="/signup">
                  
                    Sign Up
                   
                </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signin;
