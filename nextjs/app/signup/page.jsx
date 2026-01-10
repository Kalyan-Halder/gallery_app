"use client"
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";

const Signup = () => {
 
  const [formData, setFormdata] = useState({
     first_name : "",
     last_name : "",
     username:"",
     email:"",
     phone:"",
     password:"",
     conpassword:"",
     date_of_birth:"",
     bio:"",
     address:"",
     weblink:""
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter()

  const handleChange = (e)=>{
     setFormdata({
      ...formData,
      [e.target.name]:e.target.value
     })

  }
  
  const handleSubmit = async (e)=>{
    e.preventDefault()
    setError("")

    if(formData.password != formData.conpassword){
      setError("Passwords Do not Match")
      setFormdata({
        password:"",
        conpassword:""
      })
      return
    }else if(!formData.first_name || !formData.last_name || !formData.username || !formData.email || !formData.phone || !formData.password || !formData.conpassword || !formData.date_of_birth || !formData.address || !formData.bio){
      setError("All field Must be fullfilled")
      return
    }

    try{
      setLoading(true);
      const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const response = await fetch(`${BaseUrl}/registration`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(formData)
    })
    console.log(response)
      
    const data = await response.json()
    if(response.status == 400){
      setError(data.message)
      setFormdata({
        username:"",
        email:""
      })
    }else if(response.status == 200){
      setTimeout(() => {
      router.push("/verify");
      },500);
    }
    }catch(err){
      setError(err.message || "An error occurred during registration")
    }finally{
      setLoading(false)
    }
  }

 



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
      
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Sign up
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Join with our amaging community
        </p>

       
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            onChange={handleChange}
            value={formData.first_name}
            name="first_name"
            placeholder="First name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            type="text"
            onChange={handleChange}
            value={formData.last_name}
            name="last_name"
            placeholder="Last name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            type="text"
            onChange={handleChange}
            name="username"
            value={formData.username}
            placeholder="Username"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
          <input
            type="text"
            onChange={handleChange}
            value={formData.phone}
            name="phone"
            placeholder="Phone"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
          <input
            type="text"
            onChange={handleChange}
            value={formData.address}
            name="address"
            placeholder="Address"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
          <input
            type="text"
            onChange={handleChange}
            value={formData.weblink}
            name="weblink"
            placeholder="Web Link (Optional)"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
          <input
            type="text"
            onChange={handleChange}
            value={formData.bio}
            name="bio"
            placeholder="Bio...."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
          <input
            type="password"
            onChange={handleChange}
            name="password"
            value={formData.password}
            placeholder="Password (6+ characters)"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            type="password"
            onChange={handleChange}
            name="conpassword"
            value={formData.conpassword}
            placeholder="Confirm password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            type="text"
            onChange={handleChange}
            name="date_of_birth"
            value={formData.date_of_birth}
            placeholder="Date Of Birth"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black placeholder-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
           {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          
          <p className="text-xs text-gray-500 leading-snug">
            By clicking Agree & Join, you agree to the LinkedIn User Agreement,
            Privacy Policy, and Cookie Policy.
          </p>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition">
             {loading? "Loading..." : "Agree & Join"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already on Shutter Sphere?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            <Link href="/signin">
                  
                    Login
                   
                </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
