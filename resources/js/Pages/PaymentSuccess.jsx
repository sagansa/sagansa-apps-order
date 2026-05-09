import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Stack,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { router } from "@inertiajs/react";

export default function PaymentSuccess({ order, message }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 1: return 'success';
            case 5: return 'warning';
            default: return 'error';
        }
    };

    const getPaymentStatusText = (status) => {
        switch (status) {
            case 1: return 'Berhasil';
            case 5: return 'Pending';
            case 0: return 'Gagal';
            default: return 'Unknown';
        }
    };

    return (
        <>
            <Head title="Pembayaran Berhasil" />

            <Box sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                py: 6,
                px: { xs: 2, sm: 4 }
            }}>
                <Box sx={{ maxWidth: 700, mx: 'auto' }}>
                    {/* Success Header */}
                    <Card
                        elevation={0}
                        sx={{
                            mb: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            overflow: 'hidden',
                            textAlign: 'center',
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ height: 6, background: 'linear-gradient(90deg, #C6A96B, #D4AF37)' }} />
                        <CardContent sx={{ py: 6 }}>
                            <CheckCircleIcon
                                sx={{
                                    fontSize: 100,
                                    color: '#C6A96B',
                                    mb: 2,
                                    filter: 'drop-shadow(0 0 20px rgba(198, 169, 107, 0.3))'
                                }}
                            />
                            <Typography variant="h3" sx={{ fontWeight: '900', mb: 1 }}>
                                Thank You!
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                Pesanan Anda Berhasil Diterima
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                {message}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Order Summary Card */}
                    <Card
                        elevation={0}
                        sx={{
                            mb: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Detail Pesanan
                                </Typography>
                                <Chip
                                    label={getPaymentStatusText(order.payment_status)}
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: order.payment_status === 1 ? 'success.dark' : 'warning.dark',
                                        color: '#fff'
                                    }}
                                />
                            </Stack>

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Nomor Pesanan</Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>#{order.id}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Metode Pembayaran</Typography>
                                    <Typography sx={{ fontWeight: 500 }}>Transfer Manual</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Layanan Pengiriman</Typography>
                                    <Typography sx={{ fontWeight: 500 }}>{order.delivery_service?.name}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Bayar</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: '900', color: '#C6A96B' }}>
                                        {formatCurrency(order.total_price)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    {order.delivery_address && (
                        <Card
                            elevation={0}
                            sx={{
                                mb: 4,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Alamat Pengiriman
                                </Typography>
                                <Box sx={{ color: 'text.secondary' }}>
                                    <Typography sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                        {order.delivery_address.recipient_name}
                                    </Typography>
                                    <Typography variant="body2">{order.delivery_address.address}</Typography>
                                    <Typography variant="body2">
                                        {order.delivery_address.subdistrict?.name}, {order.delivery_address.district?.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {order.delivery_address.city?.name}, {order.delivery_address.province?.name}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.visit('/')}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)',
                                }
                            }}
                        >
                            Kembali ke Beranda
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => router.visit('/login')}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                fontWeight: 'bold',
                                borderColor: '#C6A96B',
                                color: '#C6A96B',
                                '&:hover': {
                                    borderColor: '#D4AF37',
                                    bgcolor: 'rgba(198, 169, 107, 0.05)'
                                }
                            }}
                        >
                            Lihat Pesanan Saya
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </>
    );
}