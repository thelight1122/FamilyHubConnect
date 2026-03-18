import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

export default function LoanConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-xl font-display text-slate-900">
      <BackHeader title="Loan Submitted" backTo={paths.financeLoan} />

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Hero Image */}
        <div className="px-4 py-3">
          <div
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-primary/10 rounded-xl min-h-[200px] border border-primary/20"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkrxyZDUdttyvQzJT7iar7YwBS8NhHyDA9BfmUMa-sQa8nRRo3Oh0WwwTQ1i3bApWTYDSsfC4-KXqiDXm6HofZorAAWIJu_Tcn6Iu9HaG8pfYwXjNvSdhRqhzP7JeQkKn3X1njSFoIDzGn61ZTuA7JiDu8AVRsUiNp_XRXciv_ogNU-uAVJeVoTSOIe230OGw7Hg5V0FIL5K4YeCtI2tgGvPesd81qBpXCOQMoGoNPMFIxg8eXikzd7iy2X8C0pIe2VCO7gyMGBR0")',
            }}
            role="img"
            aria-label="A cool modern mountain bike in a forest setting"
          />
        </div>

        {/* Amount Display */}
        <div className="text-center px-4 pt-4">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Total Approved</span>
          <h1 className="text-slate-900 tracking-tight text-[48px] font-bold leading-tight pb-2">$200.00</h1>
        </div>

        {/* Personalized Message */}
        <div className="px-6 text-center mb-8">
          <h3 className="text-slate-900 text-[22px] font-bold leading-tight tracking-tight pb-2">Great news, Leo!</h3>
          <p className="text-slate-600 text-base font-normal leading-relaxed">
            Your loan for the new mountain bike has been approved and is ready to use.
          </p>
        </div>

        {/* Terms Summary Card */}
        <div className="mx-4 bg-primary/5 rounded-xl p-6 border border-primary/10 mb-6">
          <h4 className="text-primary font-bold text-sm mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            LOAN TERMS
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Interest Rate</span>
              <span className="text-slate-900 font-semibold text-sm">0% (Family Rate)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Repayment Method</span>
              <span className="text-slate-900 font-semibold text-sm">Allowance Deduction</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Target Completion</span>
              <span className="text-slate-900 font-semibold text-sm">Oct 15, 2026</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="px-6 mb-8">
          <h4 className="text-slate-900 font-bold text-lg mb-4">Next Steps</h4>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              </div>
              <div>
                <p className="text-slate-900 font-semibold text-sm">Funds Transferred</p>
                <p className="text-slate-500 text-sm">The $200.00 has been added to your Digital Wallet.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
              </div>
              <div>
                <p className="text-slate-900 font-semibold text-sm">Scheduled Repayment</p>
                <p className="text-slate-500 text-sm">First deduction starts this Friday from your weekly allowance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-4 mt-auto">
          <button
            onClick={() => navigate(paths.finance)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            Back to Finance
            <span className="material-symbols-outlined">home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
