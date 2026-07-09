/**
 * This file contains utility functions for string manipulation.
 */

export const formatTitleCase = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Format angka menjadi bentuk ringkas: 9000 -> "9k", 1200 -> "1,2k", 500 -> "500".
 * Digunakan untuk badge "Terjual" di kartu home (hemat ruang).
 */
export const formatCompact = (n) => {
    if (n === null || n === undefined || isNaN(n)) return '0';
    n = Number(n);
    if (n < 1000) return String(n);
    if (n < 1000000) {
        // 1 desimal, buang .0 (mis. 9.0 -> 9), lalu koma sebagai pemisah desimal (id-ID)
        const formatted = Number(n / 1000).toFixed(1).replace(/\.0$/, '').replace('.', ',');
        return `${formatted}k`;
    }
    const formatted = Number(n / 1000000).toFixed(1).replace(/\.0$/, '').replace('.', ',');
    return `${formatted}m`;
};



