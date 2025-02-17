import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function SignupPage() {
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
                <Input id="name" placeholder="Full Name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="email" placeholder="Email" type="email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="password" placeholder="Password" type="password" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="confirm-password" placeholder="Confirm Password" type="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <Button className="w-full">Sign Up</Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

