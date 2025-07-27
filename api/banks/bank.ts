export const fetchBankCodes = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_BANK_CODES_URL!);
  if (!res.ok) throw new Error("Failed to fetch bank codes");
  return res.json();
};
