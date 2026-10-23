import React from 'react';
import { Coins, ChevronRight, TrendingDown, ArrowDownRight, Wallet, PieChart } from 'lucide-react';
import { CalculationResult, CalculationMethod } from '../utils/loanCalculator';
import { formatVND, formatNumber } from '../utils/formatters';

interface SummaryCardProps {
  result: CalculationResult;
  method: CalculationMethod;
  onOpenDetails: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  result,
  method,
  onOpenDetails,
}) => {
  const isReducing = method === 'reducing_balance';

  // Percentage calculations
  const total = result.totalPayment || 1;
  const principalPercent = Math.round((result.totalPrincipal / total) * 100);
  const interestPercent = 100 - principalPercent;

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Top Header with Golden Coin Icon */}
        <div className="flex items-start justify-between mb-6 pb-5 border-b border-slate-800/80">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-amber-400 mb-1">
              {isReducing ? 'Dư nợ giảm dần' : 'Trả góp đều cố định'}
            </span>
            <h3 className="text-sm sm:text-base font-medium text-slate-300">
              Số tiền trả hàng tháng:
            </h3>
          </div>

          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* Main Monthly Payment Display */}
        {isReducing ? (
          <div className="mb-6 bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Kỳ đầu (cao nhất)</span>
                <span className="text-lg sm:text-2xl font-bold text-white tracking-tight block">
                  {formatNumber(result.firstPeriodPayment)}
                </span>
                <span className="text-xs text-amber-400/90 font-medium">VND</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">Kỳ cuối (thấp nhất)</span>
                <span className="text-lg sm:text-2xl font-bold text-emerald-400 tracking-tight block">
                  {formatNumber(result.lastPeriodPayment)}
                </span>
                <span className="text-xs text-emerald-400/90 font-medium">VND</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center gap-1.5 text-xs text-slate-400">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Số tiền giảm dần theo từng kỳ trả nợ</span>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
            <span className="text-xs text-slate-400 block mb-1">Mỗi kỳ cố định</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatNumber(result.firstPeriodPayment)}
              </span>
              <span className="text-xs font-semibold text-amber-400">VND</span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Gốc tăng dần, lãi giảm dần, tổng thanh toán không đổi
            </span>
          </div>
        )}

        {/* Breakdown Items */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
            <span className="text-sm text-slate-400">Tổng gốc vay:</span>
            <span className="text-sm sm:text-base font-semibold text-slate-200">
              {formatVND(result.totalPrincipal)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
            <span className="text-sm text-slate-400">Tổng lãi phải trả:</span>
            <span className="text-sm sm:text-base font-semibold text-amber-400">
              {formatVND(result.totalInterest)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 bg-slate-800/60 px-3 rounded-lg border border-slate-700/60">
            <div>
              <span className="text-sm font-medium text-slate-200 block">Tổng tiền phải trả:</span>
              <span className="text-xs text-slate-400">(Gốc + Lãi toàn thời gian)</span>
            </div>
            <span className="text-base sm:text-xl font-bold text-white text-right">
              {formatVND(result.totalPayment)}
            </span>
          </div>
        </div>

        {/* Visual Ratio Bar */}
        <div className="mb-6 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              Gốc: {principalPercent}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Lãi: {interestPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${principalPercent}%` }}
              title={`Gốc: ${principalPercent}%`}
            />
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${interestPercent}%` }}
              title={`Lãi: ${interestPercent}%`}
            />
          </div>
        </div>
      </div>

      {/* Action Button: Xem chi tiết */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenDetails}
          className="w-full group relative flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Xem chi tiết lịch trả nợ</span>
          <ChevronRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
