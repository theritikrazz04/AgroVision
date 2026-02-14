"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

type UserProfile = {
    name: string
    email: string
    phone: string
    location: string
    plan: string
    memberSince: string
    avatarUrl: string
}

type UserContextType = {
    user: UserProfile
    updateUser: (updates: Partial<UserProfile>) => void
    isLoading: boolean
}

const defaultUser: UserProfile = {
    name: "Demo Farmer",
    email: "farmer@example.com",
    phone: "+91 98765 43210",
    location: "Punjab, India",
    plan: "Premium Plan",
    memberSince: "Jan 2024",
    avatarUrl: "/avatars/avatar-1.png"
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile>(defaultUser)
    const [isLoading, setIsLoading] = useState(true)

    // Load from local storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("user-profile")
            if (stored) {
                setUser(JSON.parse(stored))
            }
        } catch (error) {
            console.error("Failed to load user profile", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateUser = (updates: Partial<UserProfile>) => {
        setUser(prev => {
            const newUser = { ...prev, ...updates }
            try {
                localStorage.setItem("user-profile", JSON.stringify(newUser))
            } catch (error) {
                console.error("Failed to save user profile", error)
                toast.error("Failed to save changes")
            }
            return newUser
        })
    }

    return (
        <UserContext.Provider value={{ user, updateUser, isLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
