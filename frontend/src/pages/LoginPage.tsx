import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import {useContext} from "react"
import {AppContext} from "@/context/AppContext"


interface LoginResponse {
    message: string;
    error: boolean;
  }
  

export default function LoginPage() {
  const [email, setLocalEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')  
  
  const {setEmail} = useContext(AppContext)

  const navigate = useNavigate()

  const handleLogin = async () => {
    try{
        const response = await axios.post<LoginResponse>('http://127.0.0.1:5000/login', {
            email,
            password
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true  // Add this if your backend uses sessions/cookies
          });
        
        if (!response.data.error) {

            setEmail(email)

            navigate('/chat')
            
        } else {

            setError(response.data.message)
            
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // Disappear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input id="email" placeholder="Email" type="email" onChange={(e) => setLocalEmail(e.target.value)} />
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
        {error && <p className="text-sm text-red-500 text-center font-bold italic mt-4">{error}</p>}
      </Card>
    </div>
  )
}
