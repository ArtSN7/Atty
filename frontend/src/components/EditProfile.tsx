import type React from "react"
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppContext } from "@/context/AppContext"


interface UserData {
  name: string;
  email: string;
  bio: string;
  avatar: string;
}


export function EditProfile() {
  const { email } = useContext(AppContext)

  const [profile, setProfile] = useState({
    name: "",
    email: email,
    bio: "",
    avatar: "",
  })

  const [userData, setUserData] =  useState<UserData | null>(null);

  useEffect(() => {
    if (email) {
      axios.get<UserData>(`http://127.0.0.1:5000/user?email=${email}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      })
        .then(response => setUserData(response.data))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [email]);

  console.log(userData)

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.name,
        email: userData.email,
        bio: userData.bio,
        avatar: userData.avatar,
      })
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://127.0.0.1:5000/user', profile, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });
      console.log('User updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" name="name" value={profile.name} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                readOnly
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} className="mt-1" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
