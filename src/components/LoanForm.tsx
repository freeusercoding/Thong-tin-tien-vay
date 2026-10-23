import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Clock,
  Percent,
  Building,
  Settings2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  LoanInputParams,
  RepaymentCycle,
  RoundingRule,
  CalculationMethod,
} from '../utils/loanCalculator';
import {
  formatNumber,
  parseFormattedNumber,
  numberToVietnameseWords,
  formatVND,
} from '../utils/formatters';

interface LoanFormProps {
  params: LoanInputParams;
  onChange: (newParams: LoanInputParams) => void;
}

export const LoanForm: React.FC<LoanFormProps> = ({ params, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [termUnit, setTermUnit] = useState<'months' | 'years'>('months');

  // Format display strings for inputs
  const loanAmountStr = params.loanAmount ? formatNumber(params.loanAmount) : '';
  const propertyValueStr = params.propertyValue ? formatNumber(params.propertyValue) : '';

  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFormattedNumber(e.target.value);
    onChange({
      ...params,
      propertyValue: rawVal > 0 ? rawVal : undefined,
    });
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFormattedNumber(e.target.value);
    onChange({
      ...params,
      loanAmount: rawVal,
    });
  };

  const handleApplyPropertyRatio = (ratio: number) => {
    if (params.propertyValue && params.propertyValue > 0) {
      const calculated = Math.round(params.propertyValue * ratio);
      onChange({
        ...params,
        loanAmount: calculated,
      });
    }
  };

  const handleTermChange = (value: number, unit: 'months' | 'years') => {
    const months = unit === 'years' ? value * 12 : value;
    onChange({
      ...params,
      loanTermMonths: Math.max(1, months),
    });
  };

  const currentTermYears = Math.round((params.loanTermMonths / 12) * 10) / 10;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Top Method Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 sm:p-2 gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...params, method: 'reducing_balance' })}
          className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
            params.method === 'reducing_balance'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/90'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Bảng tính dư nợ giảm dần
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...params, method: 'fixed_installment' })}
          className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
            params.method === 'fixed_installment'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/90'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Bảng số tiền trả hàng tháng cố định
        </button>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Field 1: Giá trị bất động sản */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-500" />
              Giá trị bất động sản
              <span className="text-xs font-normal text-slate-400">(Tùy chọn)</span>
            </label>
            <span className="text-xs font-medium text-slate-500">VND</span>
          </div>

          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={propertyValueStr}
              onChange={handlePropertyValueChange}
              placeholder="Ví dụ: 3.000.000.000"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {params.propertyValue ? (
              <span className="absolute right-3 top-3 text-xs font-semibold text-slate-500 bg-slate-200/80 px-2 py-1 rounded">
                VNĐ
              </span>
            ) : null}
          </div>

          {params.propertyValue && params.propertyValue > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Gợi ý tỷ lệ vay:</span>
              {[0.5, 0.7, 0.8, 1.0].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => handleApplyPropertyRatio(ratio)}
                  className="px-2.5 py-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200/60 transition-colors cursor-pointer"
                >
                  {ratio * 100}% ({formatNumber(params.propertyValue! * ratio)} đ)
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Field 2: Số tiền vay (Thiết kế dạng nhập theo yêu cầu Bước 1) */}
        <div className="bg-blue-50/40 p-4 sm:p-5 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Số tiền vay <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
              Dạng nhập số
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              required
              value={loanAmountStr}
              onChange={handleLoanAmountChange}
              placeholder="Nhập số tiền muốn vay..."
              className="w-full px-4 py-3.5 bg-white border-2 border-blue-500/80 rounded-xl text-lg sm:text-xl font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm"
            />
            <span className="absolute right-3.5 top-3.5 text-sm font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              VND
            </span>
          </div>

          {/* Vietnamese words representation */}
          {params.loanAmount > 0 && (
            <div className="mt-2 text-xs sm:text-sm text-blue-900 font-medium italic flex items-start gap-1">
              <span className="font-semibold not-italic">Bằng chữ:</span>
              <span>{numberToVietnameseWords(params.loanAmount)}</span>
            </div>
          )}

          {/* Quick Amount Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-slate-500">Mức vay phổ biến:</span>
            {[
              { label: '500 triệu', value: 500_000_000 },
              { label: '1 tỷ', value: 1_000_000_000 },
              { label: '2 tỷ', value: 2_000_000_000 },
              { label: '3 tỷ', value: 3_000_000_000 },
              { label: '5 tỷ', value: 5_000_000_000 },
            ].map((chip) => (
              <button
                key={chip.value}
                type="button"
                onClick={() => onChange({ ...params, loanAmount: chip.value })}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  params.loanAmount === chip.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Thời gian vay & Lãi suất */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Thời gian vay */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                Thời gian vay
              </label>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setTermUnit('months')}
                  className={`px-2 py-0.5 rounded-md font-medium cursor-pointer ${
                    termUnit === 'months' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setTermUnit('years')}
                  className={`px-2 py-0.5 rounded-md font-medium cursor-pointer ${
                    termUnit === 'years' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Năm
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                min="1"
                max={termUnit === 'years' ? 40 : 480}
                value={termUnit === 'years' ? currentTermYears : params.loanTermMonths}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  handleTermChange(val, termUnit);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3 top-3 text-xs font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded">
                {termUnit === 'years' ? 'Năm' : 'Tháng'}
              </span>
            </div>

            <div className="mt-1.5 flex justify-between text-xs text-slate-500">
              <span>
                Tương đương: {params.loanTermMonths} tháng ({currentTermYears} năm)
              </span>
            </div>

            {/* Quick Term Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[5, 10, 15, 20, 25].map((years) => (
                <button
                  key={years}
                  type="button"
                  onClick={() => handleTermChange(years, 'years')}
                  className={`px-2 py-0.5 text-xs rounded-md border font-medium cursor-pointer ${
                    params.loanTermMonths === years * 12
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {years} năm
                </button>
              ))}
            </div>
          </div>

          {/* Lãi suất */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-slate-500" />
                Lãi suất
              </label>
              <span className="text-xs font-medium text-slate-500">%/Năm</span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={params.annualInterestRate}
                onChange={(e) =>
                  onChange({
                    ...params,
                    annualInterestRate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Ví dụ: 8.5"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3 top-3 text-xs font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded">
                %/năm
              </span>
            </div>

            <div className="mt-1.5 text-xs text-slate-500">
              Lãi suất tháng ước tính:{' '}
              <span className="font-semibold text-slate-700">
                {(params.annualInterestRate / 12).toFixed(3)}%/tháng
              </span>
            </div>

            {/* Quick Rate Presets */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { label: '6.5% Ưu đãi', rate: 6.5 },
                { label: '8.5% Trung bình', rate: 8.5 },
                { label: '10.5% Thả nổi', rate: 10.5 },
                { label: '12% Cố định', rate: 12.0 },
              ].map((item) => (
                <button
                  key={item.rate}
                  type="button"
                  onClick={() => onChange({ ...params, annualInterestRate: item.rate })}
                  className={`px-2 py-0.5 text-xs rounded-md border font-medium cursor-pointer ${
                    params.annualInterestRate === item.rate
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ngày giải ngân */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              Ngày giải ngân
            </label>
            <span className="text-xs text-slate-400">DD/MM/YYYY</span>
          </div>

          <input
            type="date"
            value={params.disbursementDate}
            onChange={(e) => onChange({ ...params, disbursementDate: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          />
        </div>

        {/* Collapsible Advanced Settings (Quy tắc tính toán nghiệp vụ 2.1 - 2.4) */}
        <div className="pt-2 border-t border-slate-200/80">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-blue-600" />
              Tùy chọn nghiệp vụ: Chu kỳ, ngày trả nợ & làm tròn
            </span>
            <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {showAdvanced ? 'Thu gọn ▲' : 'Mở rộng ▼'}
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              {/* 2.1. Chu kỳ trả nợ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chu kỳ trả nợ (Quy đổi lãi suất kỳ):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'monthly' as RepaymentCycle, label: 'Hằng tháng', desc: 'Lãi = Năm / 12' },
                    { id: 'quarterly' as RepaymentCycle, label: 'Hằng quý', desc: 'Lãi = Năm / 4' },
                    { id: 'semi-annually' as RepaymentCycle, label: '6 tháng', desc: 'Lãi = Năm / 2' },
                    { id: 'annually' as RepaymentCycle, label: 'Hằng năm', desc: 'Lãi = Năm' },
                  ].map((cycle) => (
                    <button
                      key={cycle.id}
                      type="button"
                      onClick={() => onChange({ ...params, paymentCycle: cycle.id })}
                      className={`p-2.5 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                        params.paymentCycle === cycle.id
                          ? 'bg-blue-50/80 border-blue-400 text-blue-900 font-semibold ring-1 ring-blue-400'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-semibold">{cycle.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{cycle.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2.4. Ngày trả nợ định kỳ */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Ngày trả nợ định kỳ hàng tháng/kỳ:
                  </label>
                  <span className="text-xs text-slate-500">
                    Hiện tại: Ngày {params.paymentDay}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {[5, 10, 15, 20, 25, 30].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => onChange({ ...params, paymentDay: day })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                        params.paymentDay === day
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Ngày {day}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 text-xs text-slate-600 ml-auto">
                    <span>Hoặc ngày:</span>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={params.paymentDay}
                      onChange={(e) => {
                        const d = parseInt(e.target.value, 10);
                        if (!isNaN(d) && d >= 1 && d <= 31) {
                          onChange({ ...params, paymentDay: d });
                        }
                      }}
                      className="w-14 px-2 py-1 text-center font-bold bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Ví dụ trong tài liệu: Giải ngân 10/01/2026, chọn ngày 25 → Hệ thống sinh lịch 25/02/2026, 25/03/2026...
                </p>
              </div>

              {/* 2.3. Quy tắc làm tròn số */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Quy tắc làm tròn:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: '1_vnd' as RoundingRule,
                      label: 'Làm tròn đến đơn vị đồng',
                      sub: 'Độ chính xác tuyệt đối từng đồng',
                    },
                    {
                      id: '1000_vnd' as RoundingRule,
                      label: 'Làm tròn đến 1.000 đồng',
                      sub: 'Thường áp dụng trong biểu phí ngân hàng',
                    },
                  ].map((rule) => (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => onChange({ ...params, roundingRule: rule.id })}
                      className={`p-2.5 text-left rounded-lg border text-xs cursor-pointer ${
                        params.roundingRule === rule.id
                          ? 'bg-blue-50/80 border-blue-400 text-blue-900 font-semibold ring-1 ring-blue-400'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-semibold">{rule.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{rule.sub}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  * Sai lệch do làm tròn được tự động điều chỉnh chính xác vào kỳ trả nợ cuối cùng.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
