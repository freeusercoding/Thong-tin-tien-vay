/**
 * Loan Calculation Engine based on banking specifications:
 * - Reducing Balance (Dư nợ giảm dần)
 * - Fixed Monthly Installment (Trả góp đều / Niên kim cố định)
 * Support:
 * - Frequency: Monthly, Quarterly, Semi-annually, Annually
 * - Periodic interest rate conversion
 * - Rounding rule: 1 VND or 1,000 VND with final period adjustment
 * - Auto-generation of repayment schedule dates based on disbursement date & payment day
 */

export type RepaymentCycle = 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
export type RoundingRule = '1_vnd' | '1000_vnd';
export type CalculationMethod = 'reducing_balance' | 'fixed_installment';

export interface LoanInputParams {
  propertyValue?: number; // Optional property value
  loanAmount: number; // Loan principal (VND)
  loanTermMonths: number; // Term in months
  annualInterestRate: number; // Annual rate in percent (e.g. 10.5 for 10.5%/year)
  disbursementDate: string; // YYYY-MM-DD
  paymentCycle: RepaymentCycle;
  paymentDay: number; // Day of month (1-31)
  roundingRule: RoundingRule;
  method: CalculationMethod;
}

export interface ScheduleItem {
  period: number; // 0 for disbursement, 1..n for repayment periods
  paymentDate: string; // DD/MM/YYYY
  beginningBalance: number; // Số gốc còn lại đầu kỳ
  principal: number; // Gốc trả trong kỳ
  interest: number; // Lãi trả trong kỳ
  totalPayment: number; // Tổng gốc + Lãi
  endingBalance: number; // Dư nợ cuối kỳ
}

export interface CalculationResult {
  schedule: ScheduleItem[];
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  firstPeriodPayment: number;
  lastPeriodPayment: number;
  minPayment: number;
  maxPayment: number;
  totalPeriods: number;
  interestRatePerPeriod: number; // Decimal (e.g. 0.01 for 1%)
}

/**
 * Rounds a monetary number based on the rounding rule
 */
export function applyRounding(val: number, rule: RoundingRule): number {
  if (rule === '1000_vnd') {
    return Math.round(val / 1000) * 1000;
  }
  return Math.round(val);
}

/**
 * Formats a Date object to DD/MM/YYYY
 */
export function formatDateDMY(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Generates the due date for period `i` (1..n)
 * Example from spec:
 * Disbursement: 10/01/2026.
 * Cycle: Monthly.
 * Payment day: 25.
 * Period 1: 25/02/2026
 * Period 2: 25/03/2026
 * Period 3: 25/04/2026...
 */
export function calculatePaymentDate(
  disbursementDateStr: string,
  periodIndex: number,
  cycle: RepaymentCycle,
  chosenDay: number
): Date {
  // Parse YYYY-MM-DD cleanly in local timezone
  const [yearStr, monthStr, dayStr] = disbursementDateStr.split('-');
  const startYear = parseInt(yearStr, 10);
  const startMonth = parseInt(monthStr, 10) - 1; // 0-indexed
  const startDay = parseInt(dayStr, 10);

  let monthsToAddPerPeriod = 1;
  if (cycle === 'quarterly') monthsToAddPerPeriod = 3;
  else if (cycle === 'semi-annually') monthsToAddPerPeriod = 6;
  else if (cycle === 'annually') monthsToAddPerPeriod = 12;

  // Total months from disbursement month
  // Note: Period 1 is the first repayment month.
  // In bank practice (and PDF example):
  // When disbursed on 10/01/2026, first due date is next month on chosen day (25/02/2026).
  const targetTotalMonths = startMonth + (periodIndex * monthsToAddPerPeriod);
  const targetYear = startYear + Math.floor(targetTotalMonths / 12);
  const targetMonth = ((targetTotalMonths % 12) + 12) % 12;

  // Use chosenDay, but clamp to maximum days in target month
  // (e.g. Feb 31 -> Feb 28 or 29)
  const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const effectiveDay = Math.min(chosenDay, daysInTargetMonth);

  return new Date(targetYear, targetMonth, effectiveDay);
}

export function calculateLoan(params: LoanInputParams): CalculationResult {
  const {
    loanAmount,
    loanTermMonths,
    annualInterestRate,
    disbursementDate,
    paymentCycle,
    paymentDay,
    roundingRule,
    method,
  } = params;

  if (loanAmount <= 0 || loanTermMonths <= 0 || annualInterestRate < 0) {
    return {
      schedule: [],
      totalPrincipal: 0,
      totalInterest: 0,
      totalPayment: 0,
      firstPeriodPayment: 0,
      lastPeriodPayment: 0,
      minPayment: 0,
      maxPayment: 0,
      totalPeriods: 0,
      interestRatePerPeriod: 0,
    };
  }

  // 2.1. Periodic interest rate conversion
  let cycleDivisor = 12;
  let monthsPerPeriod = 1;

  switch (paymentCycle) {
    case 'quarterly':
      cycleDivisor = 4;
      monthsPerPeriod = 3;
      break;
    case 'semi-annually':
      cycleDivisor = 2;
      monthsPerPeriod = 6;
      break;
    case 'annually':
      cycleDivisor = 1;
      monthsPerPeriod = 12;
      break;
    case 'monthly':
    default:
      cycleDivisor = 12;
      monthsPerPeriod = 1;
      break;
  }

  const periodRate = (annualInterestRate / 100) / cycleDivisor;
  const totalPeriods = Math.max(1, Math.ceil(loanTermMonths / monthsPerPeriod));

  const schedule: ScheduleItem[] = [];

  // Parse disbursement date for period 0
  const [dy, dm, dd] = disbursementDate.split('-');
  const disbDateObj = new Date(parseInt(dy, 10), parseInt(dm, 10) - 1, parseInt(dd, 10));

  // Period 0: Disbursement milestone
  schedule.push({
    period: 0,
    paymentDate: formatDateDMY(disbDateObj),
    beginningBalance: loanAmount,
    principal: 0,
    interest: 0,
    totalPayment: 0,
    endingBalance: loanAmount,
  });

  let currentBalance = loanAmount;
  let sumPrincipal = 0;
  let sumInterest = 0;

  if (method === 'reducing_balance') {
    // 1. Trả gốc đều, lãi tính trên dư nợ giảm dần
    // Gốc chuẩn mỗi kỳ (các kỳ trước kỳ cuối)
    const basePrincipalPerPeriod = applyRounding(loanAmount / totalPeriods, roundingRule);

    for (let i = 1; i <= totalPeriods; i++) {
      const periodDate = calculatePaymentDate(disbursementDate, i, paymentCycle, paymentDay);
      const beginningBalance = currentBalance;

      // Lãi kỳ hiện tại = Dư nợ đầu kỳ × Lãi suất kỳ
      const interest = applyRounding(beginningBalance * periodRate, roundingRule);

      // 2.3. Sai lệch do làm tròn được điều chỉnh vào kỳ trả nợ cuối cùng
      let principal = 0;
      if (i === totalPeriods) {
        // Final period pays off all remaining balance
        principal = beginningBalance;
      } else {
        principal = Math.min(basePrincipalPerPeriod, beginningBalance);
      }

      const totalPayment = principal + interest;
      const endingBalance = Math.max(0, beginningBalance - principal);
      currentBalance = endingBalance;

      sumPrincipal += principal;
      sumInterest += interest;

      schedule.push({
        period: i,
        paymentDate: formatDateDMY(periodDate),
        beginningBalance,
        principal,
        interest,
        totalPayment,
        endingBalance,
      });
    }
  } else {
    // 2. Trả góp đều (Fixed Installment / Annuity)
    // PMT = P * r * (1+r)^n / ((1+r)^n - 1)
    let rawPMT = 0;
    if (periodRate > 0) {
      rawPMT = (loanAmount * periodRate * Math.pow(1 + periodRate, totalPeriods)) / (Math.pow(1 + periodRate, totalPeriods) - 1);
    } else {
      rawPMT = loanAmount / totalPeriods;
    }
    const fixedPMT = applyRounding(rawPMT, roundingRule);

    for (let i = 1; i <= totalPeriods; i++) {
      const periodDate = calculatePaymentDate(disbursementDate, i, paymentCycle, paymentDay);
      const beginningBalance = currentBalance;
      const interest = applyRounding(beginningBalance * periodRate, roundingRule);

      let principal = 0;
      let totalPayment = 0;

      if (i === totalPeriods) {
        // Final period: adjust rounding residue
        principal = beginningBalance;
        totalPayment = principal + interest;
      } else {
        principal = Math.min(beginningBalance, Math.max(0, fixedPMT - interest));
        totalPayment = principal + interest;
      }

      const endingBalance = Math.max(0, beginningBalance - principal);
      currentBalance = endingBalance;

      sumPrincipal += principal;
      sumInterest += interest;

      schedule.push({
        period: i,
        paymentDate: formatDateDMY(periodDate),
        beginningBalance,
        principal,
        interest,
        totalPayment,
        endingBalance,
      });
    }
  }

  // Calculate stats for summary card
  const paymentsOnly = schedule.slice(1).map((s) => s.totalPayment);
  const minPayment = paymentsOnly.length > 0 ? Math.min(...paymentsOnly) : 0;
  const maxPayment = paymentsOnly.length > 0 ? Math.max(...paymentsOnly) : 0;
  const firstPeriodPayment = paymentsOnly.length > 0 ? paymentsOnly[0] : 0;
  const lastPeriodPayment = paymentsOnly.length > 0 ? paymentsOnly[paymentsOnly.length - 1] : 0;

  return {
    schedule,
    totalPrincipal: sumPrincipal,
    totalInterest: sumInterest,
    totalPayment: sumPrincipal + sumInterest,
    firstPeriodPayment,
    lastPeriodPayment,
    minPayment,
    maxPayment,
    totalPeriods,
    interestRatePerPeriod: periodRate,
  };
}
