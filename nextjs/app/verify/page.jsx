"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
const Verify = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
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
      const data =  sessionStorage.getItem("actionType");
      setData(data);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    //sessionStorage.removeItem("actionType");
    e.preventDefault();
    setError("");
    
    if(param_data == "reset"){
      if(!formData.email || !formData.otp || !formData.password || !formData.conpassword){
      setError("All field Must be fullfilled")
      return
    }else if(formData.password != formData.conpassword){
      setError("Password does not match")
      return
    }
    }else{
      if(!formData.email || !formData.otp){
      setError("All field Must be fullfilled")
      return
    }else if(formData.password != formData.conpassword){
      setError("Password does not match")
      return
    }
    }

    try {
      setLoading(true);
      const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const response = await fetch(`${BaseUrl}/verify`, {
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
          otp:"",
          password: "",
          conpassword: "",
        })
        setError(data.message)
      }
      else if (response.status == 200 || response.status == 201){
         if(param_data=="reset"){
          console.log(param_data)
          sessionStorage.removeItem("actionType");
          setSuccess(true)
          setError("Passsword Reset Completed. Redirecting to Login Page")
          setTimeout(() => {
          router.push("/signin");
          },2500);
         }else{
          setSuccess(true)
          setError("Verification Completed. Redirecting to Signin")
           setTimeout(() => {
          router.push("/signin");
          },1500);
         }
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
          Verify Your Email
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

          <input
            name="otp"
            type="number"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          {(param_data == "reset") && (
            <>
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
            </>
          )}

          {/* Error */}
          {error && <p className={`text-sm ${success ? 'text-green-600' : 'text-red-600'}`}>{error}</p>}

           
          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Verifing..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
