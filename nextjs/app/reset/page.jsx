"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
const Reset = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(" ");
  const router = useRouter();
  const [success, setSuccess]=useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if(!formData.email){
      setError("All field Must be fullfilled")
      return
    }

    try {
      setLoading(true);
      const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const response = await fetch(`${BaseUrl}/reset`, {
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
          otp:""
        })
        setError(data.message)
      }
      else if (response.status == 200){
        setSuccess(true)
        setError("Email Sent")
        sessionStorage.setItem('actionType', 'reset');
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
          Enter Your Email
        </h1>
         
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          {/* Error */}
          {error && <p className={`text-sm ${success ? 'text-green-600' : 'text-red-600'}`}>{error}</p>}

           
          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reset;
