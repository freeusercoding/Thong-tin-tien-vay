import React from 'react';
import { CheckCircle2, TrendingDown, Info, Scale, ArrowRight, Award } from 'lucide-react';
import {
  LoanInputParams,
  calculateLoan,
  CalculationResult,
} from '../utils/loanCalculator';
import { formatVND, formatNumber } from '../utils/formatters';

interface ComparisonViewProps {
  params: LoanInputParams;
  onSelectMethod: (method: 'reducing_balance' | 'fixed_installment') => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  params,
  onSelectMethod,
}) => {
  // Calculate results for both methods
  const reducingResult = calculateLoan({ ...params, method: 'reducing_balance' });
  const fixedResult = calculateLoan({ ...params, method: 'fixed_installment' });

  const interestDiff = fixedResult.totalInterest - reducingResult.totalInterest;
  const isReducingSaving = interestDiff > 0;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              So sánh 2 phương thức trả nợ
            </h3>
            <p className="text-xs text-slate-500">
              Chọn phương án tối ưu nhất với khả năng tài chính của bạn
            </p>
          </div>
        </div>

        {isReducingSaving && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Award className="w-3.5 h-3.5" />
            Tiết kiệm {formatVND(interestDiff)} tiền lãi
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Dư nợ giảm dần */}
        <div
          className={`p-4 rounded-xl border-2 transition-all relative ${
            params.method === 'reducing_balance'
              ? 'border-blue-500 bg-blue-50/20 shadow-xs'
              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
          }`}
        >
          {params.method === 'reducing_balance' && (
            <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Đang chọn
            </span>
          )}

          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Dư nợ giảm dần (Phổ biến)
            </h4>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Lãi thấp hơn
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700 my-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Kỳ thanh toán đầu:</span>
              <span className="font-bold text-slate-900">
                {formatVND(reducingResult.firstPeriodPayment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kỳ thanh toán cuối:</span>
              <span className="font-bold text-emerald-600">
                {formatVND(reducingResult.lastPeriodPayment)}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Tổng lãi phải trả:</span>
              <span className="font-extrabold text-blue-700">
                {formatVND(reducingResult.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-slate-600">Tổng tiền cả gốc + lãi:</span>
              <span className="text-slate-900">
                {formatVND(reducingResult.totalPayment)}
              </span>
            </div>
          </div>

          <ul className="text-[11px] text-slate-600 space-y-1 mb-4 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>Gốc trả đều mỗi tháng, tiền lãi giảm dần theo dư nợ thực tế.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>Áp lực ban đầu cao hơn, nhưng gánh nặng nợ giảm dần về sau.</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => onSelectMethod('reducing_balance')}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              params.method === 'reducing_balance'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {params.method === 'reducing_balance' ? 'Đang áp dụng' : 'Chọn phương án này'}
          </button>
        </div>

        {/* Option 2: Trả góp đều (Cố định) */}
        <div
          className={`p-4 rounded-xl border-2 transition-all relative ${
            params.method === 'fixed_installment'
              ? 'border-blue-500 bg-blue-50/20 shadow-xs'
              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
          }`}
        >
          {params.method === 'fixed_installment' && (
            <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Đang chọn
            </span>
          )}

          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Trả góp đều hàng tháng
            </h4>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
              Dễ dự toán
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700 my-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Mỗi kỳ cố định:</span>
              <span className="font-bold text-slate-900">
                {formatVND(fixedResult.firstPeriodPayment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số tiền qua các kỳ:</span>
              <span className="font-medium text-slate-600">Không đổi</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Tổng lãi phải trả:</span>
              <span className="font-extrabold text-amber-600">
                {formatVND(fixedResult.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-slate-600">Tổng tiền cả gốc + lãi:</span>
              <span className="text-slate-900">
                {formatVND(fixedResult.totalPayment)}
              </span>
            </div>
          </div>

          <ul className="text-[11px] text-slate-600 space-y-1 mb-4 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
              <span>Số tiền trả hàng tháng cố định, rất dễ lên kế hoạch chi tiêu.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
              <span>
                {isReducingSaving ? (
                  <span>
                    Tổng tiền lãi nhiều hơn khoảng{' '}
                    <span className="font-bold text-amber-700">{formatVND(interestDiff)}</span> so với dư nợ giảm dần.
                  </span>
                ) : (
                  <span>Tổng lãi tương đương phương án gốc.</span>
                )}
              </span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => onSelectMethod('fixed_installment')}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              params.method === 'fixed_installment'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {params.method === 'fixed_installment' ? 'Đang áp dụng' : 'Chọn phương án này'}
          </button>
        </div>
      </div>
    </div>
  );
};
