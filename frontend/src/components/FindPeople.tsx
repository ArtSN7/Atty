import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import axios from "axios"

interface Person {
  email: string;
}

export function FindPeople() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<Person[]>([])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        axios.get<Person[]>(`http://127.0.0.1:5000/find_people?query=${searchTerm}`)
          .then(response => {
            setResults(response.data);
          })
          .catch(error => {
            console.error('Error fetching search results:', error);
          });
      } else {
        setResults([]);
      }
    }, 300); // Delay of 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Find New People</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value) }
            className="flex-grow"
          />
          <Button type="submit" disabled>
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <AnimatePresence>
          {results.map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${person.email}`} />
                <AvatarFallback>{person.email[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{person.email}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Add
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
