"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLanguage } from "@/context/language-context";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [notifications, setNotifications] = useLocalStorage("settings-notifications", {
        email: true,
        sms: true
    })
    const { language, setLanguage, t } = useLanguage()

    const handleSave = () => {
        toast.success(t("settingsSaved"), {
            description: t("settingsSavedDesc")
        });
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">{t("settings")}</h2>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>{t("preferences")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="notifications">{t("emailNotifications")}</Label>
                        <Switch
                            id="notifications"
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="sms">{t("smsAlerts")}</Label>
                        <Switch
                            id="sms"
                            checked={notifications.sms}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="theme">{t("darkMode")}</Label>
                        <Switch
                            id="theme"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="language">{t("language")} (Hindi)</Label>
                        <Switch
                            id="language"
                            checked={language === 'hi'}
                            onCheckedChange={(checked) => setLanguage(checked ? 'hi' : 'en')}
                        />
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleSave}>{t("saveChanges")}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
