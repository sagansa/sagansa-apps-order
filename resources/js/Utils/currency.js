/**
 * Util format mata uang Rupiah — satu sumber kebenaran untuk angka uang
 * (DESIGN.md: The Ledger Rule — pemisah ribuan id-ID, digit tabular, tanpa
 * desimal).
 */

/** 1250000 -> "1.250.000" (tanpa prefiks Rp). */
export const formatIDR = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
};

/** 1250000 -> "Rp 1.250.000". */
export const formatMoney = (value) => `Rp ${formatIDR(value)}`;

/**
 * "1.250.000" / "1 250" / "1.250.000abc" -> 1250000. String kosong/invalid -> 0.
 * Dipakai parser input uang: apa pun yang diketik user, ambil digitnya saja.
 */
export const parseIDR = (str) => {
    if (str === null || str === undefined) return 0;
    const digits = String(str).replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
};
