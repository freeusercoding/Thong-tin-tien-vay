import React, { useState, useMemo, useRef } from 'react';
import {
  LoanInputParams,
  calculateLoan,
  CalculationMethod,
} from './utils/loanCalculator';
import { Header } from './components/Header';
import { LoanForm } from './components/LoanForm';
import { SummaryCard } from './components/SummaryCard';
import { AmortizationTable } from './components/AmortizationTable';
import { AmortizationModal } from './components/AmortizationModal';
import { LoanChart } from './components/LoanChart';
import { ComparisonView } from './components/ComparisonView';
import { EducationalNotes } from './components/EducationalNotes';
import {
  Coins,
  FileSpreadsheet,
  ChevronRight,
  TrendingDown,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatNumber, formatVND } from './utils/formatters';

export default function App() {
  const [params, setParams] = useState<LoanInputParams>({
    propertyValue: 3_000_000_000,
    loanAmount: 2_000_000_000,
    loanTermMonths: 240, // 20 years
    annualInterestRate: 8.5, // 8.5%
    disbursementDate: '2026-07-25',
    paymentCycle: 'monthly',
    paymentDay: 25,
    roundingRule: '1_vnd',
    method: 'reducing_balance',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const inlineTableRef = useRef<HTMLDivElement>(null);

  // Calculate schedule and stats
  const result = useMemo(() => {
    return calculateLoan(params);
  }, [params]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleScrollToInlineTable = () => {
    if (inlineTableRef.current) {
      inlineTableRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleMethodSelect = (method: CalculationMethod) => {
    setParams((prev) => ({ ...prev, method }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header onOpenDetailedTable={handleOpenModal} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Intro banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Công cụ tính lãi suất vay ngân hàng
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Bảng Tính Lãi Suất Vay & Lịch Trả Nợ
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Tính toán chính xác số tiền trả hàng tháng theo phương thức{' '}
              <strong className="text-white font-semibold">Dư nợ giảm dần</strong> hoặc{' '}
              <strong className="text-white font-semibold">Trả góp đều</strong>. Tự động sinh lịch trả nợ chi tiết, cân đối sai lệch làm tròn kỳ cuối chuẩn xác.
            </p>
          </div>

          {/* Background decorative coin shape */}
          <div className="absolute -right-6 -bottom-10 opacity-15 pointer-events-none hidden sm:block">
            <Coins className="w-64 h-64 text-amber-300" />
          </div>
        </div>

        {/* Step 1: Input Information & Step 2: Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Form: Step 1 */}
          <div className="lg:col-span-7 space-y-6">
            <LoanForm params={params} onChange={setParams} />
          </div>

          {/* Right Summary Card: Step 2 */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            <SummaryCard
              result={result}
              method={params.method}
              onOpenDetails={handleOpenModal}
            />

            {/* Quick Chart in sidebar for desktop */}
            <LoanChart result={result} loanAmount={params.loanAmount} />
          </div>
        </div>

        {/* Comparison Section between 2 methods */}
        <ComparisonView
          params={params}
          onSelectMethod={handleMethodSelect}
        />

        {/* Inline Schedule Table */}
        <div ref={inlineTableRef} id="bang-lich-tra-no" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                Bảng tính lịch trả nợ với {params.method === 'reducing_balance' ? 'dư nợ giảm dần' : 'số tiền trả hàng tháng cố định'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Chi tiết từng kỳ thanh toán (STT, Ngày thanh toán, Gốc, Lãi, Dư nợ còn lại)
              </p>
            </div>
          </div>

          <AmortizationTable
            result={result}
            method={params.method}
            loanAmount={params.loanAmount}
          />
        </div>

        {/* Educational Notes on banking formulas */}
        <EducationalNotes />
      </main>

      {/* Floating Action Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="text-[11px] text-slate-400 block truncate">
            {params.method === 'reducing_balance' ? 'Kỳ đầu (cao nhất):' : 'Trả hàng tháng:'}
          </span>
          <div className="text-base font-bold text-amber-400 truncate">
            {formatNumber(result.firstPeriodPayment)} đ
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="shrink-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Xem chi tiết</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal View for "Xem chi tiết" (matching PDF Step 2 requirement) */}
      <AmortizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
        method={params.method}
        loanAmount={params.loanAmount}
      />

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 pb-16 lg:pb-6">
        <p>
          Bảng Tính Lãi Suất Vay Ngân Hàng • Mô hình chuẩn nghiệp vụ tính dư nợ giảm dần & niên kim cố định.
        </p>
      </footer>
    </div>
  );
}
