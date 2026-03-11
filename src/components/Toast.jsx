export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl pointer-events-none whitespace-nowrap">
      {message}
    </div>
  );
}
