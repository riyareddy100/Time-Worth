export type Profile = {
  name: string;
  age: number;
  salary: number;
  hoursPerDay: number;
  daysPerWeek: number;
  currency: string;
};

const KEY = "timeworth.profile";

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
}

export type Calc = {
  monthlyHours: number;
  hourlyEarnings: number;
  hoursNeeded: number;
  daysNeeded: number;
  weeksNeeded: number;
  monthsNeeded: number;
  percentOfMonthly: number;
  meals: number;
  coffees: number;
  futureValue10y: number;
};

export function calculate(profile: Profile, price: number): Calc {
  const monthlyHours = profile.hoursPerDay * profile.daysPerWeek * 4.3;
  const hourlyEarnings = profile.salary / monthlyHours;
  const hoursNeeded = price / hourlyEarnings;
  const daysNeeded = hoursNeeded / profile.hoursPerDay;
  const weeksNeeded = daysNeeded / profile.daysPerWeek;
  const monthsNeeded = price / profile.salary;
  const percentOfMonthly = (price / profile.salary) * 100;
  const meals = price / 8;
  const coffees = price / 4;
  // FV of lump sum @ 12% for 10 years
  const futureValue10y = price * Math.pow(1.12, 10);
  return {
    monthlyHours,
    hourlyEarnings,
    hoursNeeded,
    daysNeeded,
    weeksNeeded,
    monthsNeeded,
    percentOfMonthly,
    meals,
    coffees,
    futureValue10y,
  };
}

export function greeting(name: string) {
  const h = new Date().getHours();
  const g = h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 22 ? "Good evening" : "Good night";
  return `${g}, ${name}`;
}

export const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "AED", symbol: "د.إ" },
] as const;

export function symbolOf(code: string) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export function fmt(n: number, currency: string) {
  const s = symbolOf(currency);
  const v = Math.round(n).toLocaleString("en-IN");
  return `${s}${v}`;
}
