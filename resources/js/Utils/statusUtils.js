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
    2: 'info',    // Valid
    3: 'error',   // Tidak valid
    4: 'error',   // Belum dibayar
};

export const getDeliveryStatusColor = (statusValue) => {
    return DELIVERY_STATUS_COLOR_MAP[statusValue] || 'default';
};

export const getPaymentStatusColor = (statusValue) => {
    return PAYMENT_STATUS_COLOR_MAP[statusValue] || 'default';
};
