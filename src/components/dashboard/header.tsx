import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-14 items-center justify-between px-10">
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