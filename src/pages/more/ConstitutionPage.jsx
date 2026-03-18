import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

{/* TODO: fetch constitution from /api/constitution */}

const CORE_VALUES = [
  {
    icon: 'favorite',
    iconBg: 'bg-red-50 text-red-500',
    title: 'Kindness',
    description: 'Treating everyone with empathy and understanding, even during disagreements.',
  },
  {
    icon: 'gavel',
    iconBg: 'bg-blue-50 text-blue-500',
    title: 'Honesty',
    description: 'Speaking our truth with love and maintaining transparency in our actions.',
  },
  {
    icon: 'lightbulb',
    iconBg: 'bg-amber-50 text-amber-500',
    title: 'Curiosity',
    description: 'Never stop learning about ourselves, each other, and the world around us.',
  },
];

const FAMILY_RULES = [
  'No phones at the dinner table.',
  'Listen before reacting or interrupting.',
  'Always say "I love you" before sleep.',
  'Own your mistakes and apologize sincerely.',
];

const SIGNATORIES = [
  {
    alt: 'Portrait of a smiling father',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU8w09BdJ7vaCxFAEOWMZuqONHsohLgiCVmfaMeNmBIbIwoYgK0mifTceWClXLflEqGOu9chN44ruX28Dccu4JFEz5pT6jWH2IdGkJklUGECqil5up8KtS4kaNBw-dUtpNQ4wAQvQGQ091ds_Hpnt03flFZ9gzdWnvnNoC3__u6YWc593HvWVK0xRekK3vWtkqD_L6Gu0vgMgi9vP8AytsBpaAy0pK5jpr-BD57uHo0REJDwxnO-zuPl6YupF3Ntky3Zy9D9ZkZzk',
  },
  {
    alt: 'Portrait of a smiling mother',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMUoBDD4sRfCVK6BAtNZ5lNjgBfJ_WrTpKQ9zfMxxbCdhUtUYvcC7_VZWbyIPBNwmiNXLIfgkfGzg-y1t1X1-iHYN3Ex_naGemA0CfYRbBl-J3bTqmUn9-ZX-v2Pl26Pb9iuo2vzFngBRwixSMV_6qkm-etVqV_qjMKbZii15LwMZdG9Wf_Olu9n5WdPZMk7xx-9q8P2Hd6Wm8XeDNmoDth5DjWxmU0vbKlXGC959fURI7cUUJxStJZ41bpRdqkHE1_iBdbqtp6pI',
  },
  {
    alt: 'Portrait of a teenage son',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmwR0id4AUufFVdn8FW-517Vdpi0q6twuC18_hGFgeDxoWM8__rwMoLtaXKx1R4q2wn30xkkGoeIJTfhf8SFTVoljXAKzme_6oFTdL4PEuPyC9rVBvOAkwHLjDQFrRC-RMP513Y-d3abATR4pRaDQeTBPd33h9pURDBQRvRzAd15VmkawRmCJEZvuoWhY1NH8Tkc4wyonnqc6n5xOXYkz0EXAF01Rl2NMRI-fP73FPj_wYHgEhzM_WxW_ZB-hxgvzL-uCVFh7q99Q',
  },
  {
    alt: 'Portrait of a young daughter',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLc_INlwrspIN-xnrh-zXmDlzlCBOsFanBv0FPfraKkHtj9WI64LIP8I0UKt23FWevM-4MLC0WUdmjWbG1KY4aj50zCwb6Zudo1qAhSKZPOI6KDeRVmWEL0ekjP1MSt1DgpwzW5Q9iW1wrOVrQf3zw-RRidMP0mowbkp1nZmJpXHt2_xxCo7S8MNpU2HedFePMj6VuOWv70IFUOTZZ2szuo2qUW-fQYFEfkfVvN6_Nx8BVJLcaXHVYvpUL263LGnIkIbBPI1hPkrU',
  },
];

export default function ConstitutionPage() {
  const [toast, showToast] = useToast();

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light shadow-xl overflow-x-hidden">
      <BackHeader title="Family Constitution" backTo={paths.more} rightIcon="history" />

      <main className="flex-1 w-full pb-8">
        {/* Hero / Preamble */}
        <section className="p-6 text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full mx-auto border-4 border-primary/20 p-1">
              <div
                className="w-full h-full rounded-full bg-cover bg-center"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnsWk7_azuM6hjdxSQ80QWWg3512vCqfZEi3fLwmO1wsCt194jvP1UGzx8zaTArFjv_Nsd8Wn7Du_R7J3fPLno1uLCaDbGtPCDTnJs4T0RmrYhDZkUzvAvjpQziX0BkEqZ0_7Vb1fekRxf17GgrH94rnmOe4bwwDjGnM3Hpt6EFFDWqXIM00dH3qoEzFcHU246Ls9aVdKC5Opw2uVTOuJcn4mC9uiIbW66RbkYrjmW6_iIGTAJz40swNN4iYKnB5t_d67CiR869Is')" }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
              <span className="material-symbols-outlined text-sm block">verified_user</span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">The Thompson Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed italic">
              "To foster a home of unconditional love, continuous growth, and unwavering support for every member of our family. We grow together, learn together, and celebrate each other."
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                Established June 2024
              </span>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="px-4 py-6 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 className="text-lg font-bold">Our Core Values</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {CORE_VALUES.map(value => (
              <div
                key={value.title}
                className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm"
              >
                <div className={`p-2 rounded-lg ${value.iconBg}`}>
                  <span className="material-symbols-outlined block">{value.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{value.title}</h4>
                  <p className="text-sm text-slate-500">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Family Rules */}
        <section className="px-4 py-6 space-y-4 bg-primary/5 my-4">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-primary">rule</span>
            <h3 className="text-lg font-bold">Family Rules</h3>
          </div>
          <ul className="space-y-2">
            {FAMILY_RULES.map(rule => (
              <li
                key={rule}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100"
              >
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span className="text-sm font-medium">{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Signatories */}
        <section className="px-4 py-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold">Signatories</h3>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Last Updated: Oct 12, 2023</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex -space-x-3 overflow-hidden">
              {SIGNATORIES.map((s, i) => (
                <div
                  key={i}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-cover bg-center"
                  style={{ backgroundImage: `url('${s.src}')` }}
                  aria-label={s.alt}
                />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">All members have signed</p>
              <p className="text-xs text-slate-500">Thompson Family Hub</p>
            </div>
            <div className="text-primary">
              <span className="material-symbols-outlined block">verified</span>
            </div>
          </div>
        </section>

        {/* Propose Amendment */}
        <div className="px-6 py-4">
          <button
            onClick={() => showToast('Amendment proposal submitted!')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">edit_note</span>
            Propose Amendment
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
            Amendments will be discussed in the next family meeting
          </p>
        </div>
      </main>

      <Toast message={toast} />
    </div>
  );
}
