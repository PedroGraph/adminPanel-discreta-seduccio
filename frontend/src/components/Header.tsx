
import { Menu } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsButton } from "./NotificationsButton";
import { CurrentDateTime } from "./CurrentDateTime";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="h-16 bg-gray-700 border-b border-gray-600 flex items-center justify-between px-3 md:px-6">
      <div className="flex items-center gap-2">
        {/* Menú, visible solo en mobile */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-purple-700"
            onClick={onMenuClick}
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <div className="hidden md:block w-2" /> {/* Espaciador en desktop */}
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <CurrentDateTime />
        <LanguageSwitcher />
        <NotificationsButton />
        <UserMenu />
      </div>
    </header>
  );
};
