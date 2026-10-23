import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { CalculationResult, CalculationMethod } from '../utils/loanCalculator';
import { formatNumber, formatVND } from '../utils/formatters';
import { exportScheduleToCSV } from '../utils/exportUtils';

interface AmortizationTableProps {
  result: CalculationResult;
  method: CalculationMethod;
  loanAmount: number;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  result,
  method,
  loanAmount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const methodName =
    method === 'reducing_balance'
      ? 'dư nợ giảm dần'
      : 'số tiền trả hàng tháng cố định';

  // Extract available years from schedule
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    result.schedule.forEach((item) => {
      if (item.period > 0 && item.paymentDate) {
        const parts = item.paymentDate.split('/');
        if (parts.length === 3) {
          yearsSet.add(parseInt(parts[2], 10));
        }
      }
    });
    return Array.from(yearsSet).sort();
  }, [result.schedule]);

  // Filtered schedule
  const filteredSchedule = useMemo(() => {
    return result.schedule.filter((item) => {
      // Period 0 is always included if no search, or check date
      if (item.period === 0 && selectedYear !== 'all') {
        return false;
      }

      if (selectedYear !== 'all') {
        const parts = item.paymentDate.split('/');
        if (parts.length === 3 && parseInt(parts[2], 10) !== selectedYear) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPeriod = item.period.toString().includes(q);
        const matchesDate = item.paymentDate.toLowerCase().includes(q);
        return matchesPeriod || matchesDate;
      }

      return true;
    });
  }, [result.schedule, selectedYear, searchQuery]);

  const handleExportCSV = () => {
    exportScheduleToCSV(
      result.schedule,
      result.totalPrincipal,
      result.totalInterest,
      result.totalPayment,
      `Lich_tra_no_${method === 'reducing_balance' ? 'du_no_giam_dan' : 'tra_gop_deu'}.csv`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Top Action Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Bảng tính lịch trả nợ với {methodName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng: {result.totalPeriods} kỳ thanh toán | Tổng dư nợ giải ngân: {formatVND(loanAmount)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden xs:inline">Xuất Excel</span>
            <span className="xs:hidden">Excel</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden xs:inline">In Lịch</span>
            <span className="xs:hidden">In</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo kỳ hoặc ngày (VD: 25/03/2026)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline whitespace-nowrap">
            Năm:
          </span>
          <button
            type="button"
            onClick={() => setSelectedYear('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
              selectedYear === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả ({result.schedule.length})
          </button>
          {availableYears.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                selectedYear === yr
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Năm {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          {/* Header strictly formatted like PDF */}
          <thead>
            <tr className="bg-slate-700 text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs">
              <th className="py-3 px-3 sm:px-4 text-center w-14">STT</th>
              <th className="py-3 px-3 sm:px-4 text-center">KỲ TRẢ NỢ</th>
              <th className="py-3 px-3 sm:px-4 text-right">SỐ GỐC CÒN LẠI</th>
              <th className="py-3 px-3 sm:px-4 text-right">GỐC</th>
              <th className="py-3 px-3 sm:px-4 text-right">LÃI</th>
              <th className="py-3 px-3 sm:px-4 text-right bg-slate-800">TỔNG GỐC + LÃI</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {filteredSchedule.map((item) => {
              const isPeriodZero = item.period === 0;

              return (
                <tr
                  key={item.period}
                  className={`transition-colors ${
                    isPeriodZero
                      ? 'bg-blue-50/70 font-semibold text-blue-950'
                      : item.period % 2 === 0
                      ? 'bg-slate-50/50 hover:bg-blue-50/30'
                      : 'bg-white hover:bg-blue-50/30'
                  }`}
                >
                  <td className="py-3 px-3 sm:px-4 text-center font-medium text-slate-600">
                    {item.period === 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                        0
                      </span>
                    ) : (
                      item.period
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-slate-700 font-medium whitespace-nowrap">
                    {item.paymentDate}
                    {isPeriodZero && (
                      <span className="ml-1.5 text-[10px] font-semibold text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded">
                        Giải ngân
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-semibold text-slate-800 whitespace-nowrap">
                    {formatNumber(item.beginningBalance)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right text-slate-700 whitespace-nowrap">
                    {isPeriodZero ? '-' : formatNumber(item.principal)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right text-amber-600 font-medium whitespace-nowrap">
                    {isPeriodZero ? '-' : formatNumber(item.interest)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-bold text-slate-900 bg-slate-100/60 whitespace-nowrap">
                    {isPeriodZero ? '-' : formatNumber(item.totalPayment)}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer Totals exactly matching PDF */}
          <tfoot>
            <tr className="bg-slate-700 text-white font-extrabold text-xs sm:text-sm">
              <td colSpan={2} className="py-3.5 px-3 sm:px-4 text-left tracking-wider uppercase">
                TỔNG
              </td>
              <td className="py-3.5 px-3 sm:px-4 text-right text-slate-200">
                {formatNumber(result.totalPrincipal)}
              </td>
              <td className="py-3.5 px-3 sm:px-4 text-right text-white">
                {formatNumber(result.totalPrincipal)}
              </td>
              <td className="py-3.5 px-3 sm:px-4 text-right text-amber-300">
                {formatNumber(result.totalInterest)}
              </td>
              <td className="py-3.5 px-3 sm:px-4 text-right text-white bg-slate-800">
                {formatNumber(result.totalPayment)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {filteredSchedule.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          Không tìm thấy kỳ thanh toán nào phù hợp với bộ lọc.
        </div>
      )}
    </div>
  );
};
