import React, { useEffect } from 'react';
import { X, Calendar, Download, Printer, ShieldCheck } from 'lucide-react';
import { CalculationResult, CalculationMethod } from '../utils/loanCalculator';
import { AmortizationTable } from './AmortizationTable';

interface AmortizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  method: CalculationMethod;
  loanAmount: number;
}

export const AmortizationModal: React.FC<AmortizationModalProps> = ({
  isOpen,
  onClose,
  result,
  method,
  loanAmount,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const methodName =
    method === 'reducing_balance'
      ? 'dư nợ giảm dần'
      : 'số tiền trả hàng tháng cố định';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Bảng tính lịch trả nợ với {methodName}
              </h3>
              <p className="text-xs text-slate-500">
                Chi tiết từng kỳ theo chuẩn quy tắc nghiệp vụ ngân hàng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Đóng bảng chi tiết"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1">
          <AmortizationTable
            result={result}
            method={method}
            loanAmount={loanAmount}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đã cân đối sai lệch làm tròn vào kỳ trả nợ cuối cùng (Dư nợ = 0 đ)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
