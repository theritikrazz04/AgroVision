"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AccountPage() {
    const { user, updateUser } = useUser();
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    // Sync form data with user context when user data loads or changes
    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleSave = () => {
        updateUser(formData);
        setIsEditing(false);
        toast.success(t("profileUpdated"), {
            description: t("profileUpdatedDesc")
        });
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">{t("account")}</h2>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>{t("profileInformation")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            {isEditing ? (
                                <Input
                                    className="max-w-[200px]"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            ) : (
                                <h3 className="text-xl font-medium">{user.name}</h3>
                            )}
                            <p className="text-sm text-muted-foreground">{user.plan}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-muted-foreground">{t("email")}</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            ) : (
                                <p>{user.email}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-muted-foreground">{t("phone")}</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            ) : (
                                <p>{user.phone}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-muted-foreground">{t("location")}</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            ) : (
                                <p>{user.location}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-muted-foreground">{t("memberSince")}</Label>
                            <p>{user.memberSince}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-sm font-medium text-muted-foreground">{"Choose Avatar"}</Label>
                        <div className="flex flex-wrap gap-4">
                            {[1, 2, 3, 4, 5].map((i) => {
                                const avatarPath = `/avatars/avatar-${i}.png`;
                                const isSelected = formData.avatarUrl === avatarPath;
                                return (
                                    <div
                                        key={i}
                                        className={`relative cursor-pointer rounded-full p-1 transition-all ${isSelected
                                                ? "ring-2 ring-primary ring-offset-2"
                                                : isEditing
                                                    ? "hover:ring-2 hover:ring-muted ring-offset-1"
                                                    : "opacity-75"
                                            }`}
                                        onClick={() => isEditing && setFormData({ ...formData, avatarUrl: avatarPath })}
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={avatarPath} />
                                            <AvatarFallback>A{i}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        {isEditing ? t("saveChanges") : t("editProfile")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
