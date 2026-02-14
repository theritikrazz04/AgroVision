"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations, Language, TranslationKey } from "@/lib/translations"

type LanguageContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en")

    useEffect(() => {
        const storedLang = localStorage.getItem("settings-language") as Language
        if (storedLang && (storedLang === "en" || storedLang === "hi")) {
            setLanguageState(storedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem("settings-language", lang)
    }

    const t = (key: TranslationKey) => {
        return translations[language][key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
