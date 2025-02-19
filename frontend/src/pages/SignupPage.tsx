import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"


interface SignupResponse {
  error: boolean
  message: string
}

export default function SignupPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')


  const navigate = useNavigate()

  const handleSignup = async () => {

    if (password !== confirmPassword) {

      setError('Passwords do not match')

      return;
    }

    try{

        const response = await axios.post<SignupResponse>('http://127.0.0.1:5000/signup', {
            email,
            password,
            name
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true  // Add this if your backend uses sessions/cookies
        })

        if (response.data.error) {

          setError(response.data.message)
          
        }else{

          navigate('/chat')
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
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to start chatting</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input id="name" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="email" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="password" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="confirm-password" placeholder="Confirm Password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <Button onClick={handleSignup} className="w-full">Sign Up</Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
        {error && <p className="text-sm text-red-500 text-center font-bold italic mt-4">{error}</p>}
      </Card>
    </div>
  )
}

