import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link }from "react-router-dom"
import { useState } from "react"
import axios from "axios"


interface LoginResponse {
    message: string;
  }
  

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')    

  const handleLogin = async () => {
    try{
        const response = await axios.post<LoginResponse>('http://localhost:5000/login', {
          email,
          password
        })
        
        if (response.status === 201) {
            
        } else {

            setError(response.data.message)
            
        }
    } catch (error) {

        console.log(error)
        
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input id="email" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="password" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <Button className="w-full" onClick={handleLogin}>Log In</Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </Card>
    </div>
  )
}

