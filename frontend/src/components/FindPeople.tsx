"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"

const people = [
  { id: 1, name: "Emma Watson", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Emma" },
  { id: 2, name: "Tom Hardy", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Tom" },
  { id: 3, name: "Zoe Saldana", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Zoe" },
  { id: 4, name: "Chris Evans", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Chris" },
  { id: 5, name: "Scarlett Johansson", avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Scarlett" },
]

export function FindPeople() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState(people)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = people.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setResults(filtered)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Find New People</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <AnimatePresence>
          {results.map((person) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={person.avatar} />
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{person.name}</p>
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


