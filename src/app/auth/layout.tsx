import Image from "next/image";


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
          <Image
            src="/assets/logo.svg"
            alt="Orvio Logo"
            width={300}
            height={300}
            priority
            className="drop-shadow-md"
          />
        {children}
      </div>
    </div>
  );
}
