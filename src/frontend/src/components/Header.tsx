import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Cloud, LogOut, Pencil, Tags } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { EditNameDialog } from "./EditNameDialog";
import { TagManagementDialog } from "./TagManagementDialog";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const [tagManagementOpen, setTagManagementOpen] = useState(false);

  const handleLogout = () => {
    queryClient.clear();
    clear();
  };

  return (
    <>
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Cloud className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight font-display text-foreground">
            ICcloud
          </span>
        </div>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0"
              data-ocid="header.toggle"
            >
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Welcome back, {userName}!</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setEditNameDialogOpen(true)}
              data-ocid="header.edit_button"
            >
              <Pencil className="h-4 w-4" />
              Edit Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTagManagementOpen(true)}
              data-ocid="header.secondary_button"
            >
              <Tags className="h-4 w-4" />
              Manage Tags
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              data-ocid="header.delete_button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <EditNameDialog
        open={editNameDialogOpen}
        onOpenChange={setEditNameDialogOpen}
        currentName={userName}
      />

      <TagManagementDialog
        open={tagManagementOpen}
        onOpenChange={setTagManagementOpen}
      />
    </>
  );
}
