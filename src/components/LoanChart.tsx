import React from 'react';
import { CalculationResult } from '../utils/loanCalculator';
import { formatNumber, formatVND } from '../utils/formatters';

interface LoanChartProps {
  result: CalculationResult;
  loanAmount: number;
}

export const LoanChart: React.FC<LoanChartProps> = ({ result, loanAmount }) => {
  const schedule = result.schedule;
  if (!schedule || schedule.length <= 1) return null;

  // Take sample points for smooth SVG path (up to 30 points)
  const step = Math.max(1, Math.floor((schedule.length - 1) / 30));
  const samplePoints: { period: number; balance: number; interest: number }[] = [];

  for (let i = 0; i < schedule.length; i += step) {
    samplePoints.push({
      period: schedule[i].period,
      balance: schedule[i].beginningBalance,
      interest: schedule[i].interest,
    });
  }
  // Ensure last period is included
  const lastItem = schedule[schedule.length - 1];
  if (samplePoints[samplePoints.length - 1].period !== lastItem.period) {
    samplePoints.push({
      period: lastItem.period,
      balance: 0,
      interest: lastItem.interest,
    });
  }

  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const maxBalance = loanAmount || 1;
  const totalPeriods = result.totalPeriods || 1;

  // Build points for balance line
  const balancePoints = samplePoints.map((p) => {
    const x = paddingX + (p.period / totalPeriods) * chartW;
    const y = paddingY + chartH - (p.balance / maxBalance) * chartH;
    return `${x},${y}`;
  });

  const balancePath = `M ${balancePoints.join(' L ')}`;
  const areaPath = `${balancePath} L ${paddingX + chartW},${paddingY + chartH} L ${paddingX},${paddingY + chartH} Z`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Biểu đồ diễn tiến dư nợ qua các kỳ</h4>
          <p className="text-xs text-slate-500">
            Dư nợ gốc giảm dần từ {formatVND(loanAmount)} về 0 ₫ sau {totalPeriods} kỳ
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-blue-700">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            Dư nợ gốc còn lại
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-48 overflow-visible"
        >
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={paddingX + chartW}
            y2={paddingY}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY + chartH / 2}
            x2={paddingX + chartW}
            y2={paddingY + chartH / 2}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY + chartH}
            x2={paddingX + chartW}
            y2={paddingY + chartH}
            stroke="#cbd5e1"
          />

          {/* Labels */}
          <text x={paddingX - 5} y={paddingY + 4} textAnchor="end" fontSize="10" fill="#64748b">
            {formatNumber(loanAmount)}
          </text>
          <text x={paddingX - 5} y={paddingY + chartH / 2 + 4} textAnchor="end" fontSize="10" fill="#64748b">
            {formatNumber(loanAmount / 2)}
          </text>
          <text x={paddingX - 5} y={paddingY + chartH + 4} textAnchor="end" fontSize="10" fill="#64748b">
            0
          </text>

          {/* X Axis milestones */}
          <text x={paddingX} y={height - 5} textAnchor="middle" fontSize="10" fill="#64748b">
            Kỳ 0
          </text>
          <text x={paddingX + chartW / 2} y={height - 5} textAnchor="middle" fontSize="10" fill="#64748b">
            Kỳ {Math.round(totalPeriods / 2)}
          </text>
          <text x={paddingX + chartW} y={height - 5} textAnchor="middle" fontSize="10" fill="#64748b">
            Kỳ {totalPeriods}
          </text>

          {/* Area fill */}
          <path d={areaPath} fill="url(#balanceGradient)" />

          {/* Line */}
          <path
            d={balancePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
