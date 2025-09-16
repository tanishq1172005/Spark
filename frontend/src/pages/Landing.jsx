import React, { useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles,LogIn, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"

export default function Landing(){
  const navigate = useNavigate()
  const {user}=useContext(UserContext)
  const handleCreateAccount =()=>{
    if(user){
      navigate('/home')
    }else{
      navigate('/signup')
    }
  }
  const handleSignin=()=>{
    if(user){
      navigate('/home')
    }else{
      navigate('/login')
    }
  }
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
    
      <section className="relative hidden md:flex items-center justify-center overflow-hidden">
      
        <div className="pointer-events-none absolute -top-24 -left-24 size-[55vw] min-w-[480px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-[55vw] min-w-[480px] rounded-full bg-primary/15 blur-3xl" />

        <div className="relative flex items-center justify-center">
          <div className="grid place-items-center rounded-3xl border border-border/60 bg-card/30 backdrop-blur-xl shadow-2xl size-[420px]">
            <Sparkles className="w-[280px] h-[280px] text-primary drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)]" />
          </div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20),transparent_60%)]" />
        </div>
      </section>

    
      <section className="flex flex-col gap-10 px-6 md:px-10 py-10 md:py-16 max-w-xl w-full">
        <header className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Happening now</h1>
          <p className="text-2xl md:text-3xl font-semibold">Join Spark today.</p>
        </header>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Get started</CardTitle>
            <CardDescription>Create an account or continue with a provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">

            <Button onClick={handleCreateAccount} className="w-full cursor-pointer" aria-label="Create account">
              Create account
            </Button>

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
            </p>
          </CardContent>
          <CardFooter className="flex-col items-start gap-3">
            <div className="space-y-3 w-full">
              <p className="text-lg font-semibold">Already have an account?</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSignin} variant="outline" className="sm:w-auto w-full cursor-pointer" aria-label="Sign in">
                  <LogIn className="size-4 mr-2" />
                  Sign in
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <footer className="text-xs text-muted-foreground">
          <p>
            Spark is made as a substitute for Twitter for India for learning and experimentation. This project is not affiliated with X Corp.
          </p>
        </footer>
      </section>
    </main>
  )
}