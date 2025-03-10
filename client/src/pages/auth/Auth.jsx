import React from 'react'
import Background from '@/assets/login2.png' 
import Trial from '@/assets/abs.jpg'
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client.js'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { userAppStore } from '@/store'

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = userAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 
  const validateSignUp = () => {
    if(!email.length){
      toast.error("Email is required");
      return false;
    }
    if(!password.length){
      toast.error("Password is required");
      return false;
    }
    if(password !== confirmPassword){
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }

  const validateLogin= () =>{
    if(!email.length){
      toast.error("Email is required");
      return false;
    }
    if(!password.length){
      toast.error("Password is required");
      return false;
    }
    return true;
  }
  const handleLogin = async () => {
    if(validateLogin()){
      try{
        const response = await apiClient.post(
          LOGIN_ROUTE, 
          {email , password},
          {withCredentials:true}
        );
        console.log({response})
        toast.success("User Logged In Successfully!")
        if(response.data.user.id){
          setUserInfo(response.data.user);
          if(response.data.user.profileSetup){
            navigate("/chat");
          }
          else{
            navigate("/profile");
          }
        }
      }
      catch(error){
        if(error.response && error.response.status === 400){
          toast.error("User Does Not Exist!")
        } else {
          toast.error("Internal Server Error!")
        }
      }
    }
  }

  const handleSignUp = async () => {
    if(validateSignUp()){
      try{
        const response = await apiClient.post(SIGNUP_ROUTE, {email , password}, {withCredentials:true})
        console.log({response})
        toast.success("User Created Successfully!")
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      }
      catch(error){
        if(error.response && error.response.status === 400){
          toast.error("User Already Exists!")
        } else {
          toast.error("Internal Server Error!")
        }
      }
    }
  }

  return (
    <div className="h-[100vh] flex items-center justify-center w-full">
      <div className=" h-[100vh] w-[100vw]   flex justify-around items-center  xl:grid-cols-2 ">

        <div className="bg-white flex flex-col items-center justify-center gap-5 w-full h-full">
        <div className="flex items-start justify-start flex-col w-5/6">
  <div className="flex items-center justify-start">
    <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
    <img src={Victory} className="h-[100px]" alt="Victory IMG" />
  </div>
  <p className="text-left font-normal">
    Fill this to get Started with the Best Chat Application
  </p>
</div>

          <div className="flex items-center justify-center w-full">
          {/* This is the structure from SHADCN */}
          <Tabs defaultValue='login' className='w-5/6	 flex items-center justify-center flex-col'>
            <TabsList className="w-full bg-transparent rounded-none">
              <TabsTrigger value='signup' className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'>Sign Up</TabsTrigger>
              <TabsTrigger value='login' className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'>Login</TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col mt-5 w-full gap-3" value='signup'>
              <Input placeholder="Email" className="rounded-xl p-6" value={email} onChange={(e)=>setEmail(e.target.value)}/>
              <Input placeholder="Password" className="rounded-xl p-6" value={password} onChange={(e)=>setPassword(e.target.value)}/>
              <Input placeholder="Confirm Password" className="rounded-xl p-6" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
              <Button onClick={handleSignUp} className="rounded-full p-6 hover:bg-opacity-60">Sign Up</Button>
            </TabsContent>
            <TabsContent className="flex flex-col w-full gap-3" value='login' >
            <Input placeholder="Email" className="rounded-xl p-6" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <Input placeholder="Password" className="rounded-xl p-6" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <Button onClick={handleLogin} className="rounded-full p-6 hover:bg-opacity-60">Login</Button>
            </TabsContent>
          </Tabs>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center w-full">
          <img src={ Trial } className='h-screen w-full object-cover'  alt="Background IMG" />
        </div>
      </div>
    </div>
  )
}

export default Auth