export type BillingPlanId = 'month' | 'quarter' | 'year';

export interface BillingPlan {
  id: BillingPlanId;
  title: string;
  description: string;
  amount: number;
  durationMonths: number;
  IS_RECCCURENT: boolean;
}

export const BILLING_PLANS: Record<BillingPlanId, BillingPlan> = {
  month: {
    id: 'month',
    title: '1 месяц',
    description: 'Доступ к MySimpleEnglish на 1 месяц',
    amount: 999,
    durationMonths: 1,
    IS_RECCCURENT: false,
  },
  quarter: {
    id: 'quarter',
    title: '3 месяца',
    description: 'Доступ к MySimpleEnglish на 3 месяца',
    amount: 2590,
    durationMonths: 3,
    IS_RECCCURENT: false,
  },
  year: {
    id: 'year',
    title: '12 месяцев',
    description: 'Доступ к MySimpleEnglish на 12 месяцев',
    amount: 8990,
    durationMonths: 12,
    IS_RECCCURENT: false,
  },
};

export const BILLING_PLAN_LIST = Object.values(BILLING_PLANS);

export function getBillingPlan(value: unknown): BillingPlan | null {
  return typeof value === 'string' && value in BILLING_PLANS
    ? BILLING_PLANS[value as BillingPlanId]
    : null;
}

export function findBillingPlanByAmount(
  amount: number,
  isRecurrent: boolean,
): BillingPlan | null {
  return (
    BILLING_PLAN_LIST.find(
      (plan) =>
        plan.amount === amount && plan.IS_RECCCURENT === isRecurrent,
    ) ?? null
  );
}
