export default function NoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>; // No layout wrapping, renders children as-is
  }