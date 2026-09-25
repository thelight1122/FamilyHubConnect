// Shown for the moment a page's code is loading on first visit.
export default function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading page">
      <span className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
}
