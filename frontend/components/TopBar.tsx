"use client"

import { MobileSidebar } from "@/components/Sidebar";
import { User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useUser } from "@/context/user-context"
import { useLanguage } from "@/context/language-context"

export function TopBar() {
    const { user } = useUser()
    const { t } = useLanguage()
    return (
        <div className="flex items-center p-4 border-b bg-background shadow-sm">
            <MobileSidebar />
            <div className="flex w-full justify-end space-x-4 items-center">
                <ModeToggle />
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="relative cursor-pointer">
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600 border border-white z-10"></span>
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">{t("notifications")}</h4>
                                <p className="text-sm text-muted-foreground">
                                    You have 3 unread messages.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">Market Alert</p>
                                        <p className="text-xs text-muted-foreground">Wheat prices are up by 5% today.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">New Report Available</p>
                                        <p className="text-xs text-muted-foreground">Your monthly soil analysis is ready.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">System Update</p>
                                        <p className="text-xs text-muted-foreground">Platform maintenance scheduled for tonight.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="flex items-center gap-x-2">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{t("plan")}</span>
                    </div>
                    <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
