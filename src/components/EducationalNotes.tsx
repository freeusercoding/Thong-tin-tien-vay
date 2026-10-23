import React from 'react';
import { BookOpen, Check, HelpCircle, ArrowRight, ShieldCheck, Calculator } from 'lucide-react';

export const EducationalNotes: React.FC = () => {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
          <BookOpen className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Nguyên tắc tính toán nghiệp vụ ngân hàng
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-700">
        {/* Section 1: Nguyên tắc phương thức */}
        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              1
            </span>
            Trả gốc đều, lãi tính trên dư nợ giảm dần
          </h4>
          <p className="text-slate-600">
            Đây là phương thức phổ biến và chuẩn mực nhất tại hầu hết các hệ thống ngân hàng thương mại Việt Nam.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-1 font-mono text-xs">
            <p>• <strong>Gốc trả mỗi kỳ</strong> = Số tiền vay / Tổng số kỳ trả nợ</p>
            <p>• <strong>Lãi kỳ hiện tại</strong> = Dư nợ đầu kỳ × Lãi suất kỳ</p>
            <p>• <strong>Tổng tiền trả kỳ</strong> = Gốc kỳ + Lãi kỳ</p>
          </div>
          <p className="text-slate-600">
            <strong className="text-slate-900">Đặc điểm:</strong> Số tiền phải trả ban đầu cao nhất, sau đó giảm dần đều theo thời gian. Tổng lãi phải trả luôn thấp hơn so với phương thức trả góp đều.
          </p>
        </div>

        {/* Section 2: Quy tắc quy đổi & làm tròn */}
        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              2
            </span>
            Quy tắc quy đổi lãi suất & ngày trả nợ
          </h4>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Quy đổi lãi suất kỳ:</strong> Hằng tháng (Lãi năm / 12), Hằng quý (Lãi năm / 4), 6 tháng (Lãi năm / 2).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Tính dư nợ:</strong> Dư nợ cuối kỳ = Dư nợ đầu kỳ - Gốc đã trả trong kỳ. Dư nợ đầu kỳ sau = Dư nợ cuối kỳ trước.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Làm tròn số:</strong> Hỗ trợ làm tròn đến đơn vị đồng hoặc 1.000 đồng. Sai lệch do làm tròn được tự động điều chỉnh vào kỳ trả nợ cuối cùng để tất toán chính xác về 0 đ.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Sinh ngày trả nợ:</strong> Tự động tính ngày thanh toán định kỳ theo ngày giải ngân và chu kỳ lựa chọn.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
