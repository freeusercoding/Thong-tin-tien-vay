import React from 'react';
import { Landmark, Calculator, Sparkles, FileSpreadsheet, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenDetailedTable: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDetailedTable }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
            <Landmark className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                Bảng Tính Lãi Suất Vay
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Chuẩn Ngân Hàng
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Tính lịch trả nợ dư nợ giảm dần & trả góp đều tự động, chính xác
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={onOpenDetailedTable}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Xem Bảng Lịch</span>
            <span className="xs:hidden">Bảng Lịch</span>
          </button>
        </div>
      </div>
    </header>
  );
};
