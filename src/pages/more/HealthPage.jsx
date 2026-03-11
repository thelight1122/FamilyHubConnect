import BackHeader from '../../components/BackHeader';
import { healthData } from '../../data/mockData';

export default function HealthPage() {
  const health = healthData;
  const member = health?.member ?? { name: 'Leo Thompson', age: 12, bloodType: 'A+', allergies: 'None', vaccinationStatus: 'Up to Date' };
  const colorDot = { red: 'bg-red-400', orange: 'bg-orange-400', primary: 'bg-[#4c8ce6]', blue: 'bg-blue-400' };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <BackHeader title="Leo's Health Logs" rightIcon="more_vert" />

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile summary card */}
        <div className="mx-4 mt-4 bg-[#4c8ce6]/5 rounded-2xl p-4 border border-[#4c8ce6]/15">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-[#4c8ce6]/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#4c8ce6] text-3xl">person</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800">{member.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">Age {member.age} &bull; Blood Type {member.bloodType}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-[#4c8ce6]/10 text-[#4c8ce6] text-xs font-semibold px-3 py-1 rounded-full">
              No Allergies
            </span>
            <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
              Up to Date
            </span>
          </div>
        </div>

        {/* Log New Health Event button */}
        <div className="px-4 mt-4">
          <button
            onClick={() => {}}
            className="w-full bg-[#4c8ce6] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Log New Health Event
          </button>
        </div>

        {/* Active Medications */}
        <div className="px-4 mt-5">
          <h3 className="text-base font-bold text-slate-800 mb-3">Active Medications</h3>
          <div className="flex flex-col gap-3">
            {health.medications.map((med, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4c8ce6]/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#4c8ce6] text-xl">{med.icon ?? 'medication'}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{med.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{med.dose} &bull; {med.frequency ?? med.freq}</p>
                </div>
                <div className="text-right">
                  {med.daysLeft != null ? (
                    <>
                      <p className="text-xs text-slate-400">Days left</p>
                      <p className="text-xs font-semibold text-amber-500">{med.daysLeft} days</p>
                    </>
                  ) : (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${med.taken ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {med.taken ? 'Taken' : 'Due'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health History */}
        <div className="px-4 mt-5">
          <h3 className="text-base font-bold text-slate-800 mb-3">Health History</h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div className="flex flex-col gap-4">
              {health.history.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0 z-10">
                    <div className={`w-5 h-5 rounded-full ${colorDot[event.color] ?? event.color ?? 'bg-slate-400'} border-2 border-white shadow-sm mt-1`} />
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4 mb-1">
                    <p className="font-bold text-slate-800 text-sm">{event.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 mb-1.5">{event.date}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{event.desc ?? event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medical disclaimer */}
        <p className="text-xs text-slate-400 text-center px-8 mt-6 mb-4 leading-relaxed">
          This log is for informational purposes only and does not replace professional medical advice. Always consult a qualified healthcare provider.
        </p>
      </div>
    </div>
  );
}
