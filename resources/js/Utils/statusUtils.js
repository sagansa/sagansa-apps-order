/**
 * Berkas ini berisi fungsi utilitas untuk menentukan warna status
 * berdasarkan ID numerik dari backend.
 */

// Mapping untuk status pengiriman
const DELIVERY_STATUS_COLOR_MAP = {
    1: 'info',    // Belum dikirim
    2: 'info',    // Diproses
    3: 'success', // Sudah dikirim
    4: 'info',    // Siap dikirim
    5: 'error',   // Perbaiki
    6: 'error',   // Dikembalikan
};

// Mapping untuk status pembayaran
const PAYMENT_STATUS_COLOR_MAP = {
    1: 'success', // Dibayar
    2: 'success', // Valid
    3: 'error',   // Tidak valid
    4: 'default', // Belum dibayar
    5: 'warning', // Pending
};

export const getDeliveryStatusColor = (statusValue) => {
    return DELIVERY_STATUS_COLOR_MAP[statusValue] || 'default';
};

export const getPaymentStatusColor = (statusValue) => {
    return PAYMENT_STATUS_COLOR_MAP[statusValue] || 'default';
};

const PAYMENT_STATUS_BG_MAP = {
    success: 'success.dark',
    warning: 'warning.dark',
    error: 'error.dark',
    default: 'grey.400',
    info: 'info.dark',
};

export const getPaymentStatusBgColor = (statusValue) => {
    const color = getPaymentStatusColor(statusValue);
    return PAYMENT_STATUS_BG_MAP[color] || 'grey.400';
};

export const getPaymentStatusText = (status) => {
    switch (status) {
        case 1: return 'Dibayar';
        case 2: return 'Valid';
        case 3: return 'Tidak Valid';
        case 4: return 'Belum Dibayar';
        case 5: return 'Pending';
        default: return 'Tidak Diketahui';
    }
};
