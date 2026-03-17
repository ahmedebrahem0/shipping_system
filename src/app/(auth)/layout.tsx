// (auth)/layout.tsx
// Layout for auth pages - no sidebar or header needed

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  );
}