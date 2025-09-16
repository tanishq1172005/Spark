import React, { useContext, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/utils/axiosInstance"
import { API_PATHS } from "@/utils/apiPath"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"

export default function Login() {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState(null)
  const navigate = useNavigate()
  const {updateUser} =useContext(UserContext)

  const handleLogin=async(e)=>{
    e.preventDefault()
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{email,password})
      const token =response.data;
      if(token){
        localStorage.setItem("token",token)
        updateUser(response.data)
        navigate('/home')
      }
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
          <h1 className="text-5xl font-black mb-4">Welcome back</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Log in to continue to your account.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 md:px-10 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Enter your email and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input value={email} id="email" type="email" placeholder="you@example.com" onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input value={password} id="password" type="password" placeholder="••••••••" onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <Button onClick={handleLogin} className="w-full cursor-pointer">Log in</Button>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <p className="text-sm text-muted-foreground">New to Spark?</p>
            <a href="/signup" className="text-sm font-medium text-primary hover:underline">Create account</a>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}