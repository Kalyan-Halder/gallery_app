"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
const Password_Reset = () => {
  const [formData, setFormData] = useState({
    password: "",
    conpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(" ");
  const router = useRouter();
  const [success, setSuccess]=useState(false);
  const [param_data, setData] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("actionType");
      setData(data);
      //
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if(!formData.password || !formData.conpassword){
      setError("All field Must be fullfilled")
      return
    }
    if(formData.password != formData.conpassword){
      setError("Password does not match")
      return
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8000/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if(response.status == 400){
        setFormData({
          password:"",
          conpassword:""
        })
        setError(data.message)
      }
      if (response.status == 200){
          setSuccess(true)
          setError("Verification Completed. Redirecting to Signin")
           setTimeout(() => {
          router.push("/signin");
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
          Reset Your Password
        </h1>

         
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            name="conpassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.conpassword}
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
            {loading ? "Resetting..." : "Reset"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Password_Reset;
