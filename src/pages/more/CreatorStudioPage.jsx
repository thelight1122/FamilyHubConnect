import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

// TODO: fetch creations from /api/creator

export default function CreatorStudioPage() {
  const [toast, showToast] = useToast();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Toast message={toast} />
      <BackHeader title="Creator Studio" backTo={paths.more} />

      {/* Hero Section */}
      <section className="px-4 pt-6 pb-2">
        <div
          className="rounded-2xl p-6 text-white shadow-lg shadow-primary/20"
          style={{ background: 'linear-gradient(135deg, #4c8ce6 0%, #a78bfa 100%)' }}
        >
          <h2 className="text-2xl font-extrabold mb-1">Unleash your imagination!</h2>
          <p className="text-white/80 text-sm font-medium">
            Pick a tool and start creating something amazing today.
          </p>
        </div>
      </section>

      {/* Creative Tools Grid */}
      <main className="flex-1">
        <h2 className="text-slate-900 text-xl font-bold px-4 pb-3 pt-6">Creative Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">

          {/* AI Avatar Maker */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[4/3] w-full bg-slate-100 relative">
              <img
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB95janPJDrvtBmggv0IK7wQ56-w2s9SVG0x9q2e8-_jrCTKKeXbTNgX-3mly5kODOucklDaTZSxXsEAnlEsq1bO5PCxftRev7bfxKRy0GFlnls_uWHHQrHq7ks2o75ysUsglcCCTAXer9toyx-f-vKDBNAdu2LHwjFfNc7Z_2wFq-U3K78985r0BOQ0RW0McaYbM3N-SAEqErcXYKOU_38FI9cQ2suQ3uz8yu5ZJ8qqU9JZkz8SEfPodyUwL4m6WtBkv6ti5hJado"
                alt="A colorful stylized digital 3D avatar of a smiling young person"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-primary uppercase border border-primary/20">
                Popular
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-xl">face</span>
                <h3 className="font-bold text-slate-900">AI Avatar Maker</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-1">
                Transform yourself into a hero or a toon!
              </p>
              <button
                onClick={() => showToast('Creator tools coming soon!')}
                className="w-full py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
              >
                Launch Maker
              </button>
            </div>
          </div>

          {/* Magic Story Generator */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[4/3] w-full bg-indigo-50 flex items-center justify-center p-6">
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner bg-white flex flex-col p-4 border border-indigo-100">
                <div className="h-2 w-1/2 bg-indigo-100 rounded mb-2"></div>
                <div className="h-2 w-3/4 bg-indigo-50 rounded mb-2"></div>
                <div className="h-2 w-2/3 bg-indigo-50 rounded mb-4"></div>
                <div className="mt-auto flex justify-center">
                  <span className="material-symbols-outlined text-5xl text-indigo-400">auto_stories</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-indigo-500 text-xl">auto_fix_high</span>
                <h3 className="font-bold text-slate-900">Magic Story Generator</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-1">Co-write epic tales with AI.</p>
              <button
                onClick={() => showToast('Creator tools coming soon!')}
                className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Create a New Story
              </button>
            </div>
          </div>

          {/* AI Mad Libs */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[4/3] w-full bg-orange-50 flex items-center justify-center overflow-hidden">
              <div className="flex flex-wrap gap-2 px-8">
                <div className="px-3 py-1 bg-orange-200 text-orange-700 rounded-full text-xs font-bold rotate-[-5deg]">Noun</div>
                <div className="px-3 py-1 bg-pink-200 text-pink-700 rounded-full text-xs font-bold rotate-[3deg]">Adjective</div>
                <div className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-xs font-bold rotate-[-2deg]">Verb</div>
                <div className="px-3 py-1 bg-green-200 text-green-700 rounded-full text-xs font-bold rotate-[6deg]">Place</div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-orange-500 text-xl">mood</span>
                <h3 className="font-bold text-slate-900">AI Mad Libs</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-1">Hilarious AI-powered word games.</p>
              <button
                onClick={() => showToast('Creator tools coming soon!')}
                className="w-full py-2.5 rounded-xl bg-orange-100 text-orange-600 font-bold text-sm hover:bg-orange-500 hover:text-white transition-all"
              >
                Play Now
              </button>
            </div>
          </div>

          {/* Digital Drawing Board */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[4/3] w-full bg-slate-100 relative">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC40KGN40P_4-tvKaaOmbsNK-rKAx8QSDJktYVBNCgHd2K8KOheB4URhFb7UmUBvtLXO6npeUY55Z405qn48OY6pZkzn1lTm3oSoU6PK09iyisRgtWQIzlmHaQbDxLLQj5ALFMiAcjP3iqd7Ovbrwa4C1SbsGdBaZbRtmYbKM3KwybFEC8aKzgbtJYzgvNWkUo8HBa-9HKyGHTjrqPz0Wq4KFkmkjfZP2oIt_kvDI_bjV-0kKN2RRk_h0IWVOTwgRpgosorHR4wms0"
                alt="A bright, colorful abstract digital painting with brush strokes"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 uppercase border border-slate-200">
                Recent Doodle
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-emerald-500 text-xl">brush</span>
                <h3 className="font-bold text-slate-900">Digital Drawing Board</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-1">
                Sketch, paint, and animate with AI help.
              </p>
              <button
                onClick={() => showToast('Creator tools coming soon!')}
                className="w-full py-2.5 rounded-xl bg-emerald-100 text-emerald-600 font-bold text-sm hover:bg-emerald-500 hover:text-white transition-all"
              >
                Open Canvas
              </button>
            </div>
          </div>
        </div>

        {/* Recently Created */}
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900 text-lg font-bold">Your Latest Masterpieces</h2>
            <button
              onClick={() => showToast('Creator tools coming soon!')}
              className="text-primary text-xs font-bold uppercase tracking-wider"
            >
              See Gallery
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex-shrink-0 w-32 h-32 rounded-xl bg-slate-200 overflow-hidden relative border-2 border-white shadow-sm">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTKe4tG89GcrsQn016cbIulgH4yGHsgcvteDK-gOxRoa1R9t97dtUXeUsD8cK7Pm3mEBDcQYTeiH7v38x10qXV2pHENldoA1YNmZ49Myl6nF6g7jendR0TqpSfy16djKU_-T9Af2cawLF4CEQvtqeyp4kDpvOPjjNNLlupkWmGEAiTN5xJ8f5Jw5_KSrEvcbW6l-XsKgxRE4nMxXVqYl_mTJ8Q4MffWGIKlyTO3PHqaYGJjgf_pX73kjL9eKzn1RVBsQwxDKeRYZM"
                alt="Abstract colorful child's artwork showing a sun and clouds"
              />
            </div>
            <div className="flex-shrink-0 w-32 h-32 rounded-xl bg-slate-200 overflow-hidden relative border-2 border-white shadow-sm">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyWHgtsQqm5b5e7mz_YLjhFSX46GYHPRQQUmomOPK-kD1iJ01ICi0ZsP9flDSeLZjRz_0h8bPJOjwT1vzkqclhDjFGphcgsnqXKDBntoTEY81Ff1tCQdDsAFe8Ic7MjV0sdV31_8Ct8b0zYpEU428QHczqTwCXg8FXcWe4UVuYZjqcfYo4OxDndsxpsdoBoFC-Y41Ks2li_9IIYZ7tNnHTDQHWcqEqyx2GPEF_F2hfTWA2vkMfTmcE2-LPt6ZQOsbB1nNVBws8r-0"
                alt="Digital art of a neon cosmic space nebula"
              />
            </div>
            <div className="flex-shrink-0 w-32 h-32 rounded-xl bg-slate-200 overflow-hidden relative border-2 border-white shadow-sm">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjwaylqYFUqZo4AOkyqXU8vd0PBc28Cg7GP3yZfo7Z4reidPJoOOakcNFBfIT1D5F8ItsSsJ07tq1mc50D9C6iDWQWu3YruRNqmUcLHdCvxzruSRfjclOU_eR4V98y3WE9fbjzMm34L5SW8QpP2MZ6yzB_4dNjkMLmC-KZzVAsjOTlasB6lbfuUHB5O3xUpjLa2nd14KXM5JJQ1G6i5yNdGg5KDlOx02P5pq73rP9q8d3BudLIgu1nxrJRyFtOce6OgWMOmwQE0SQ"
                alt="Vibrant multi-colored liquid marble texture"
              />
            </div>
          </div>
        </section>
      </main>

      {/* FAB */}
      <button
        onClick={() => showToast('Creator tools coming soon!')}
        className="fixed bottom-20 right-4 bg-primary rounded-full w-14 h-14 shadow-xl flex items-center justify-center hover:bg-primary/90 transition-colors z-30"
      >
        <span className="material-symbols-outlined text-white text-3xl">add</span>
      </button>
    </div>
  );
}
