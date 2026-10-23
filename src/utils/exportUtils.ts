import { ScheduleItem } from './loanCalculator';

export function exportScheduleToCSV(
  schedule: ScheduleItem[],
  totalPrincipal: number,
  totalInterest: number,
  totalPayment: number,
  fileName: string = 'Lich_tra_no_chi_tiet.csv'
) {
  // UTF-8 BOM so Excel opens Vietnamese text cleanly without garbled characters
  let csvContent = '\uFEFF';

  // Header info
  csvContent += 'BẢNG TÍNH LỊCH TRẢ NỢ VỚI DƯ NỢ GIẢM DẦN\n';
  csvContent += 'STT,KỲ TRẢ NỢ,SỐ GỐC CÒN LẠI (VND),GỐC (VND),LÃI (VND),TỔNG GỐC + LÃI (VND)\n';

  schedule.forEach((item) => {
    csvContent += `${item.period},"${item.paymentDate}",${item.beginningBalance},${item.principal},${item.interest},${item.totalPayment}\n`;
  });

  // Total footer row
  csvContent += `TỔNG CỘNG,,${totalPrincipal},${totalPrincipal},${totalInterest},${totalPayment}\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
