import React, { useContext, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate, Link } from "react-router-dom"
import { UserContext } from "../context/userContext"
import axiosInstance from "@/utils/axiosInstance"
import { API_PATHS } from "@/utils/apiPath"
import { UserRoundPen } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Signup() {
  const [fullName,setFullName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [image,setImage]=useState(null)
  const [error,setError]=useState(null)
  const {updateUser}=useContext(UserContext)
  const navigate = useNavigate()
  const previewUrl = useMemo(()=> image ? URL.createObjectURL(image) : null,[image])

  const handleSignup=async(e)=>{
    e.preventDefault()
    try{
      const formData = new FormData()
      formData.append("name",fullName)
      formData.append("email",email)
      formData.append("password",password)
      if(image){
        formData.append("image",image)
      }
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER,formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })
      const token = res.data;
      if(token){
        localStorage.setItem("token",token)
      }
      updateUser(res.data)
      navigate('/home')
    }catch(err){
      if(err.response && err.response.data.message){
        setError(err.response.data.message)
      }else{
        setError("Something went wrong")
      }
    }
  }
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
    
      <section className="hidden md:flex items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-5xl font-black mb-4">Create your account</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Join Spark and be part of the conversation. Follow topics you care about and see what people are talking about.
          </p>
        </div>
      </section>

    
      <section className="flex items-center justify-center px-6 md:px-10 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>Start by entering your details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="signup-image" className="cursor-pointer rounded-full flex items-center justify-center border p-3" title="Upload profile image">
                <UserRoundPen size={28} aria-hidden="true" />
              </label>
              <Avatar className="h-14 w-14">
                {previewUrl && <AvatarImage src={previewUrl} alt="Preview" />}
                <AvatarFallback>IMG</AvatarFallback>
              </Avatar>
            </div>
            <Input id='signup-image' type='file' accept='image/*' onChange={(e)=>setImage(e.target.files?.[0]||null)} className='hidden'/>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name"
              value={fullName} onChange={(e)=>setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email"
              value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password"
              value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && (
              <p className="text-red-500">{error}</p>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>
            <Button className="w-full cursor-pointer">Create account</Button>
            </form>
          </CardContent>
          <CardFooter className="justify-between">
            <p className="text-sm text-muted-foreground">Already have an account?</p>
            <Link to="/login" className="text-sm font-medium text-primary hover:underline cursor-pointer">Log in</Link>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}
