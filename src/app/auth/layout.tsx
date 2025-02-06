import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600'],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
      {/* Background patterns */}
      <div className="fixed inset-0 w-full h-full">
        <Image
          src="/assets/light-pattern.svg"
          alt="Background Pattern"
          fill
          className="object-cover opacity-50 dark:hidden"
          priority
        />
        <Image
          src="/assets/dark-pattern.svg"
          alt="Background Pattern"
          fill
          className="object-cover opacity-50 hidden dark:block"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full">
        <div className="flex items-center gap-4">
          <h1
            className={`${playfair.className} text-5xl font-semibold bg-gradient-to-r from-[#8B7355] to-[#4A3728] bg-clip-text text-transparent tracking-wide`}
          >
            Toggle
          </h1>
          <Image
            src="/assets/logo.svg"
            alt="Toggle Logo"
            width={60}
            height={60}
            priority
            className="drop-shadow-md"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
