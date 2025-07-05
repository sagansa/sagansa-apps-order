import { Typography, Box, Button, Paper, Stack, CircularProgress } from '@mui/material';
import { usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import { useTheme } from '@mui/material/styles'; // Import useTheme
import axios from 'axios'; // Import axios for API calls

export default function CheckoutSuccess({ auth, deliveryType, message, salesOrder, paymentMethod, order_details_for_whatsapp }) {
    const isSelfPickup = deliveryType === 'self_pickup';
    // const { flash } = usePage().props; // No longer needed for order_details_for_whatsapp
    const theme = useTheme();

    const [midtransLoading, setMidtransLoading] = useState(false);
    const [showTransferDetails, setShowTransferDetails] = useState(false);

    useEffect(() => {
        // Load Midtrans Snap script
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Use sandbox for development
        const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

        if (!clientKey) {
            console.error('Midtrans Client Key is not defined. Please set VITE_MIDTRANS_CLIENT_KEY in your .env file.');
            return;
        }

        const script = document.createElement('script');
        script.src = midtransScriptUrl;
        script.setAttribute('data-client-key', clientKey);
            script.onload = () => {
                console.log('Midtrans Snap script loaded successfully.');
                console.log('Payment Method:', paymentMethod);
                console.log('Sales Order Status:', salesOrder?.status);
                console.log('Sales Order Payment Status:', salesOrder?.payment_status);
                // If paymentMethod is midtrans, automatically trigger payment
                if (paymentOrder === 'midtrans' && salesOrder && salesOrder.payment_status === 6) { // Changed to status 6
                    console.log('Attempting to trigger Midtrans payment...');
                    handleMidtransPayment();
                } else if (paymentMethod === 'manual_transfer' && salesOrder && salesOrder.status === 'pending_manual_transfer') {
                    setShowTransferDetails(true);
                }
            };
        script.onerror = () => {
            console.error('Failed to load Midtrans Snap script.');
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [paymentMethod, salesOrder]); // Added paymentMethod and salesOrder to dependency array

    useEffect(() => {
        const orderDetails = order_details_for_whatsapp; // Get from props directly

        // Only send WhatsApp message if payment method is manual_transfer or payment status is 4 (pending admin confirmation)
        if (orderDetails && (paymentMethod === 'manual_transfer' || salesOrder.payment_status === 4)) {
            const adminWhatsappNumber = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER;
            if (adminWhatsappNumber) {
                let whatsappMessage = `*Pesanan Baru dari Sagansa:*\n\n`;
                whatsappMessage += `*Nomor Pesanan:* ${orderDetails.order_number}\n`;
                whatsappMessage += `*Nama Pelanggan:* ${orderDetails.customer_name}\n`;
                whatsappMessage += `*Total Pembayaran:* Rp ${orderDetails.total_amount.toLocaleString('id-ID')}\n`;
                whatsappMessage += `*Metode Pengiriman:* ${orderDetails.delivery_method}\n`;

                if (orderDetails.delivery_address) {
                    const addr = orderDetails.delivery_address;
                    whatsappMessage += `*Alamat Pengiriman:*\n`;
                    whatsappMessage += `  Nama: ${addr.name}\n`;
                    whatsappMessage += `  Penerima: ${addr.recipient_name}\n`;
                    whatsappMessage += `  Telepon: ${addr.recipient_telp_no}\n`;
                    whatsappMessage += `  Detail: ${addr.address}, ${addr.subdistrict}, ${addr.district}, ${addr.city}, ${addr.province}, ${addr.postal_code}\n`;
                } else {
                    whatsappMessage += `*Alamat Pengiriman:* N/A (Ambil Sendiri)\n`;
                }

                whatsappMessage += `*Metode Pembayaran:* ${orderDetails.payment_status === 1 ? 'Sudah Dibayar' : 'Belum Dibayar'}\n`;
                if (orderDetails.transfer_account) {
                    const acc = orderDetails.transfer_account;
                    whatsappMessage += `  Bank: ${acc.bank_name}\n`;
                    whatsappMessage += `  No. Rek: ${acc.account_number}\n`;
                    whatsappMessage += `  Atas Nama: ${acc.account_name}\n`;
                }

                whatsappMessage += `\n*Daftar Produk:*\n`;
                orderDetails.products.forEach((product, index) => {
                    whatsappMessage += `  ${index + 1}. ${product.name} (${product.quantity} ${product.unit}) - Rp ${product.price.toLocaleString('id-ID')}\n`;
                });

                whatsappMessage += `\n*Biaya Pengiriman:* Rp ${orderDetails.shipping_cost.toLocaleString('id-ID')}\n`;
                whatsappMessage += `*Tanggal Pengiriman yang Direncanakan:* ${orderDetails.delivery_date}\n`;
                whatsappMessage += `\nLink Order: ${window.location.origin}/order/${orderDetails.order_id}\n`;

                const encodedMessage = encodeURIComponent(whatsappMessage);
                window.open(`https://wa.me/${adminWhatsappNumber}?text=${encodedMessage}`, '_blank');
            } else {
                console.warn('WHATSAPP_ADMIN_NUMBER is not defined in environment variables.');
            }
        }
    }, [order_details_for_whatsapp]); // Changed dependency to order_details_for_whatsapp

    const handleMidtransPayment = async () => {
        setMidtransLoading(true);
        try {
            const response = await axios.post('/api/midtrans/snap-token', {
                order_id: salesOrder.id,
                amount: salesOrder.total_price,
                customer_details: {
                    first_name: auth.user.name,
                    email: auth.user.email,
                    phone: auth.user.phone_number || '081234567890', // Assuming phone_number exists or provide a default
                },
            });

            const snapToken = response.data.snap_token;
            if (snapToken) {
                window.snap.pay(snapToken, {
                    onSuccess: function(result) {
                        alert("Payment success!");
                        console.log(result);
                        router.visit(`/transaction-detail/${salesOrder.id}`);
                    },
                    onPending: function(result) {
                        alert("Waiting for your payment!");
                        console.log(result);
                        router.visit(`/transaction-detail/${salesOrder.id}`);
                    },
                    onError: function(result) {
                        alert("Payment failed!");
                        console.log(result);
                        router.visit(`/transaction-detail/${salesOrder.id}`);
                    },
                    onClose: function() {
                        alert('You closed the popup without finishing the payment');
                        router.visit(`/transaction-detail/${salesOrder.id}`);
                    }
                });
            }
        } catch (error) {
            console.error('Error generating snap token:', error);
            alert('Failed to initiate Midtrans payment. Please try again.');
        } finally {
            setMidtransLoading(false);
        }
    };

    const handleManualTransfer = () => {
        setShowTransferDetails(true);
        // The salesOrder status should already be 'pending_manual_transfer' if this button is shown
        // No need to call set-manual-transfer again here unless it's a retry scenario
    };


    return (
            <AuthenticatedLayout
                user={auth.user}
                header={<Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                    Checkout Berhasil
                </Typography>}
            >
                <Box sx={{
                    minHeight: 'calc(100vh - 200px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    bgcolor: theme.palette.background.default,
                }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            maxWidth: 600,
                            width: '100%',
                            textAlign: 'center',
                            bgcolor: theme.palette.background.paper,
                        }}
                    >
                        <CheckCircleIcon
                            sx={{
                                fontSize: 80,
                                color: 'success.main',
                                mb: 2
                            }}
                        />

                        <Typography variant="h4" gutterBottom>
                            Pesanan Berhasil Dibuat!
                        </Typography>

                        <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            {isSelfPickup ? (
                                <StorefrontIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            ) : (
                                <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            )}
                            <Typography variant="body1">
                                {message}
                            </Typography>
                            {isSelfPickup && (
                                <Typography variant="body2" color="text.secondary">
                                    Jangan lupa untuk menunjukkan bukti pemesanan saat pengambilan pesanan.
                                </Typography>
                            )}
                        </Stack>

                        {/* Display payment options only if salesOrder payment_status is 6 (pending Midtrans) and paymentMethod is not explicitly set to trigger auto-payment */}
                        {!showTransferDetails && salesOrder && salesOrder.payment_status === 6 && paymentMethod !== 'manual_transfer' && ( // Changed to status 6
                            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom>
                                    Pilih Metode Pembayaran
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleMidtransPayment}
                                    disabled={midtransLoading}
                                >
                                    {midtransLoading ? <CircularProgress size={24} /> : 'Bayar dengan Midtrans'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleManualTransfer}
                                >
                                    Transfer Bank Manual
                                </Button>
                            </Box>
                        )}

                        {/* Show manual transfer details if selected or if salesOrder status is pending_manual_transfer */}
                        {(showTransferDetails || (salesOrder && salesOrder.status === 'pending_manual_transfer')) && salesOrder && (
                            <Box sx={{ mt: 4, textAlign: 'left' }}>
                                <Typography variant="h6" gutterBottom>
                                    Detail Transfer Bank Manual
                                </Typography>
                                <Typography variant="body1">
                                    Silakan transfer ke rekening berikut:
                                </Typography>
                                {salesOrder.transferToAccount ? (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            **Bank:** {salesOrder.transferToAccount.bank.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            **Nomor Rekening:** {salesOrder.transferToAccount.account_number}
                                        </Typography>
                                        <Typography variant="body2">
                                            **Atas Nama:** {salesOrder.transferToAccount.account_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            **Jumlah:** Rp {salesOrder.total_price.toLocaleString('id-ID')}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="error">
                                        Detail rekening transfer tidak tersedia.
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Pesanan Anda akan diproses setelah pembayaran diverifikasi.
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.visit(`/transaction-detail/${salesOrder.id}`)}
                            >
                                Lihat Detail Pesanan
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => router.visit('/')}
                            >
                                Kembali ke Beranda
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </AuthenticatedLayout>
    );
}
