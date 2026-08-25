export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background/50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
