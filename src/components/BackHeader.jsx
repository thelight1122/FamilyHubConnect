import { useNavigate } from 'react-router-dom';

export default function BackHeader({ title, rightIcon, onRightClick, backTo }) {
  const navigate = useNavigate();
  const handleBack = () => (backTo ? navigate(backTo) : navigate(-1));

  return (
    <header className="sticky top-0 z-10 flex items-center bg-white border-b border-slate-100 px-4 py-3">
      <button
        onClick={handleBack}
        className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h2 className="flex-1 text-center text-lg font-bold text-slate-900 pr-10">
        {title}
      </h2>
      {rightIcon && (
        <button
          onClick={onRightClick}
          className="absolute right-4 flex size-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600"
        >
          <span className="material-symbols-outlined">{rightIcon}</span>
        </button>
      )}
    </header>
  );
}
