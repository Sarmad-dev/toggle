import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/assets/logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="font-semibold">TimeTrack</span>
        </div>
        
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
} 