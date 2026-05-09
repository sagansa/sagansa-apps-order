import {
    Typography,
    Box,
    Button,
    Paper,
    Stack,
    Container,
    Avatar,
    Divider,
} from "@mui/material";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function CheckoutSuccess({
    auth,
    sales_order,
}) {
    const handleWhatsAppRedirect = () => {
        const adminWhatsappNumber = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER;
        if (!adminWhatsappNumber) return;

        const message = `Halo Admin Sagansa, saya ingin konfirmasi pesanan #${sales_order?.order_number}.\n\nSilakan cek detail pesanan saya di sistem.`;
        window.open(`https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pesanan Berhasil" />
            
            <Box sx={{ py: 10, bgcolor: 'background.default', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="sm">
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ height: 8, position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(90deg, #C6A96B, #D4AF37)' }} />
                        
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                color: 'success.main',
                                margin: '0 auto 24px',
                                border: '2px solid',
                                borderColor: 'success.main'
                            }}
                        >
                            <CheckCircleIcon sx={{ fontSize: 48 }} />
                        </Avatar>

                        <Typography variant="overline" sx={{ color: '#C6A96B', fontWeight: 'bold', letterSpacing: '2px' }}>
                            Terima Kasih
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: '900', mb: 2, letterSpacing: '-1px' }}>
                            Pesanan Diterima
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
                            Pesanan Anda {sales_order?.order_number ? <strong>#{sales_order.order_number}</strong> : 'telah berhasil dibuat'}. Silakan lakukan pembayaran melalui transfer bank untuk memproses pesanan Anda.
                        </Typography>

                        {sales_order && (
                            <Box sx={{ p: 3, bgcolor: 'rgba(198, 169, 107, 0.05)', borderRadius: 3, border: '1px dashed #C6A96B', mb: 4, textAlign: 'left' }}>
                                <Typography variant="subtitle1" sx={{ color: '#C6A96B', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ReceiptLongIcon fontSize="small" /> Detail Pembayaran
                                </Typography>
                                
                                {sales_order.transfer_to_account ? (
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Bank</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{sales_order.transfer_to_account.bank?.name}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">No. Rekening</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{sales_order.transfer_to_account.number}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Atas Nama</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{sales_order.transfer_to_account.name}</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Transfer</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: '900', color: '#C6A96B' }}>
                                                Rp {sales_order.total_price?.toLocaleString('id-ID')}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="error">
                                        Detail rekening transfer tidak tersedia. Silakan hubungi admin.
                                    </Typography>
                                )}
                            </Box>
                        )}

                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => sales_order?.id && router.visit(route('order.show', { id: sales_order.id }))}
                                sx={{
                                    py: 2,
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)',
                                    boxShadow: '0 8px 16px rgba(198, 169, 107, 0.2)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)',
                                    }
                                }}
                            >
                                Lihat Detail Pesanan
                            </Button>
                            
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<WhatsAppIcon />}
                                onClick={handleWhatsAppRedirect}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    borderColor: '#25D366',
                                    color: '#25D366',
                                    '&:hover': {
                                        borderColor: '#128C7E',
                                        bgcolor: 'rgba(37, 211, 102, 0.05)',
                                    }
                                }}
                            >
                                Konfirmasi via WhatsApp
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => router.visit(route('order.index'))}
                                sx={{ color: 'text.secondary', fontWeight: 'bold' }}
                            >
                                Kembali Belanja
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
