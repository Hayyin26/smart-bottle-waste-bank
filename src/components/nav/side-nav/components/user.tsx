"use client";

import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { clearProfileData } from "@/services/profile-no-sql.service";

export default function User() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get nama dari full_name atau email
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
          setUserName(name);
        }
      } catch {
        // ignore error
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Clear profile data from localStorage
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        clearProfileData(user.id);
      }
      // Logout from Supabase
      await supabase.auth.signOut();
      // Redirect to login
      router.push("/login");
    } catch {
      // ignore error
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-16 items-center border-b border-border px-2">
      <div className="relative w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center">
            <Image
              src="/avatar.png"
              alt="User"
              className="mr-2 rounded-full"
              width={36}
              height={36}
            />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-sm font-medium truncate">{userName}</span>
            </div>
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-border z-50 overflow-hidden">
            {/* Profile Button */}
            <button
              onClick={() => {
                router.push("/profile");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors first:rounded-t-md"
            >
              <UserCircle size={16} />
              Profil
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors last:rounded-b-md disabled:opacity-50"
            >
              <LogOut size={16} />
              {isLoading ? "Logging out..." : "Keluar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
