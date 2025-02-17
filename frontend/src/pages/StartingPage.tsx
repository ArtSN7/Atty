import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          ModernChat
        </h1>
        <p className="text-xl mb-8 text-muted-foreground">Connect with friends in style</p>
      </div>

      <div className="flex space-x-4">
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}

