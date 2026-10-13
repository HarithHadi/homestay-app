export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col gap-6 items-center justify-center p-4">
      {children}
    </div>
  );
}
