"use client";

import {
  Menu,
  Search,
  Bell,
  Home,
  Users,
  ShoppingBag,
  FileText,
  UserCog,
  LogOut,
  Plus,
  CheckCircle2,
  UserPlus,
  Truck,
  PiggyBank,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import SalesTransactionForm from "../SalesTransactionForm";
import ExpenseManagement from "../ExpenseManagement";
import FloatingCalculator from "../FloatingCalculator";
import { useRouter } from "next/navigation";
import { set } from "mongoose";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Users, label: "Farmers", href: "/farmers" },
  { icon: Users, label: "Buyers", href: "/buyers" },
  { icon: UserCog, label: "Staff", href: "/staff" },
  { icon: PiggyBank, label: "Loans", href: "/loans" },
  { icon: ShoppingBag, label: "Sales", href: "/sales" },
  { icon: FileText, label: "Reports", href: "/reports" },
];

// Sample notifications (replace with real data later)
const notifications = [
  {
    id: 1,
    type: "sale",
    icon: ShoppingBag,
    color: "text-green-600",
    title: "New sale",
    highlight: "#SALE8921",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "farmer",
    icon: UserPlus,
    color: "text-blue-600",
    title: "New farmer registered",
    highlight: "Anil Sharma",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "delivery",
    icon: Truck,
    color: "text-purple-600",
    title: "Delivery arrived",
    highlight: "Wheat 500kg",
    time: "45 minutes ago",
  },
];

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [name, setName] = useState("");
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // In your DashboardLayout or Logout button
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // Important for cookies
    });

    // Redirect to login
    window.location.href = "/login";
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    setName(name || "");
  }, []);
  // Notification Bell Component
  const NotificationBell = () => {
    const unreadCount = notifications.length;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 mr-4" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <Button variant="ghost" size="sm">
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="h-96">
            <div className="p-2">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif, i) => (
                  <div key={notif.id}>
                    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition">
                      <div className="mt-0.5">
                        <notif.icon className={`h-5 w-5 ${notif.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {notif.title} <strong>{notif.highlight}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notif.time}
                        </p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </div>
                    {i < notifications.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  };

  // Mobile Notification Sheet
  const MobileNotificationSheet = () => {
    const unreadCount = notifications.length;

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <Button variant="ghost" size="sm">
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="h-full">
            <div className="p-2">
              {notifications.map((notif, i) => (
                <div key={notif.id}>
                  <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition">
                    <div className="mt-0.5">
                      <notif.icon className={`h-5 w-5 ${notif.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {notif.title} <strong>{notif.highlight}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                  {i < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-primary">Digital Mandi</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              asChild
            >
              <a href={item.href}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold text-primary">Digital Mandi</h1>
          </div>
          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                asChild
              >
                <a href={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </a>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2 w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search sales, farmers..." className="h-9" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Expense Button */}
            <Button
              className="bg-red-600 text-white hover:bg-primary/90"
              onClick={() => setShowExpenseForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Expense
            </Button>
            {/* New Sale Button */}
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowSaleForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> New Sale
            </Button>
            {/* Notification Bell (Desktop: Popover, Mobile: Sheet) */}
            {isMobile ? <MobileNotificationSheet /> : <NotificationBell />}
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{name || "AD"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{name || "Admin"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {showSaleForm ? (
            <div className="space-y-6">
              <SalesTransactionForm />
            </div>
          ) : showExpenseForm ? (
            <div className="space-y-6">
              <ExpenseManagement />
            </div>
          ) : (
            children
          )}
          <FloatingCalculator />
        </main>
      </div>
    </div>
  );
}
