// Format date: Jan 15, 2024
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Format date with time: Jan 15, 2024 - 10:30 AM
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Format currency: 1,500 EGP
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} EGP`;
}

// Format phone: 01012345678 → +20 101 234 5678
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("20")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.startsWith("0")) {
    return `+20 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

// Truncate long text: "Hello World..." 
export function truncate(text: string, length: number = 30): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}