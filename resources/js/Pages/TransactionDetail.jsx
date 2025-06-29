import { Head } from '@inertiajs/react';
import {
    Box,
    Typography,
    Paper,
    Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Divider, Button, Grid, Avatar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Snackbar, TextField
} from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


// Fungsi untuk mengubah teks menjadi Title Case
const formatTitleCase = (text) => {
    if (!text) return '';
    return text.toLowerCase().split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

const statusColor = (deliveryStatusLabel) => {
    switch (deliveryStatusLabel) {
        case 'Sudah dikirim': return 'success';
        case 'Perbaiki':
        case 'Dikembalikan': return 'error';
        case 'Belum dikirim':
        case 'Siap dikirim':
        case 'Diproses':
             return 'info';
        default: return 'default';
    }
};

export default function DetailTransaction({ auth, order, transferToAccounts }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const { data, setData, post, processing, errors, reset } = useForm({
        image_payment: null,
        transfer_to_account_id: '',
        shipping_cost: order.shipping_cost ?? 0,
    });

    const handleOpenUploadModal = () => {
        setOpenUploadModal(true);
    };

    const handleCloseUploadModal = () => {
        setOpenUploadModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        reset();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validasi tipe file
            if (!file.type.startsWith('image/')) {
                alert('File harus berupa gambar');
                return;
            }
            // Validasi ukuran file (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file maksimal 2MB');
                return;
            }
            setSelectedFile(file);
            setData('image_payment', file);

            // Buat preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleUpload = () => {
        // Validasi form sebelum submit
        if (!data.transfer_to_account_id) {
            setSnackbar({
                open: true,
                message: 'Mohon pilih rekening tujuan transfer.',
                severity: 'error'
            });
            return;
        }
        if (!data.image_payment) {
            setSnackbar({
                open: true,
                message: 'Mohon pilih file bukti transfer.',
                severity: 'error'
            });
            return;
        }

        // Allow shipping_cost to be 0
        if (order.payment_status_label === 'Belum dibayar' && order.delivery_service_id !== 33) {
            if (data.shipping_cost === null || data.shipping_cost < 0) { // Only check for null or negative, allow 0
                setSnackbar({
                    open: true,
                    message: 'Mohon masukkan nominal biaya pengiriman yang valid (tidak negatif).',
                    severity: 'error'
                });
                return;
            }
        }

        post(route('order.update-payment', order.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseUploadModal();
                setSnackbar({
                    open: true,
                    message: 'Bukti transfer berhasil diupload!',
                    severity: 'success'
                });
                router.reload();
            },
            onError: (errors) => {
                console.error('Upload error:', errors);
                let errorMessage = 'Terjadi kesalahan saat upload bukti transfer.';

                if (errors && typeof errors === 'object') {
                    const errorMessages = Object.values(errors).flat();
                    if (errorMessages.length > 0) {
                        errorMessage = errorMessages.join('\n');
                    }
                }

                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
                });
            },
        });
    };

    // Tambahkan useEffect untuk menginisialisasi nilai awal
    useEffect(() => {
        if (order) {
            setData('shipping_cost', order.shipping_cost ?? 0);
        }
    }, [order]);

    if (!order) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">Data pesanan tidak ditemukan.</Typography>
                </Box>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>Invoice Pesanan</Typography>}
        >

                <Head title="Transaction Detail" />


                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                    <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, width: '100%', bgcolor: 'background.paper', borderRadius: 3, boxShadow: 6 }}>
                        {/* Header Invoice */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                <ReceiptLongIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight={700} color="primary.main">INVOICE</Typography>
                                <Typography variant="subtitle2" color="text.secondary">No. Pesanan: {order.order_number}</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }} />
                            <Chip label={order.delivery_status_label} color={statusColor(order.delivery_status_label)} size="medium" />
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        {/* Info Atas */}
                        <Grid container spacing={2} sx={{ mb: 3 }} columns={{ xs: 12, md: 12 }}>
                            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                                <Typography variant="subtitle2" color="text.secondary">Tanggal Pesanan</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>{order.date}</Typography>
                                <Typography variant="subtitle2" color="text.secondary">Diterima Oleh</Typography>
                                <Typography variant="body1">{order.received_by || '-'}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>No. Resi</Typography>
                                <Typography variant="body1">{order.receipt_no || '-'}</Typography>
                            </Grid>
                            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                                <Typography variant="subtitle2" color="text.secondary">Transfer Ke Rekening</Typography>
                                {order.transfer_to_account ? (
                                    <Typography variant="body1">
                                        {order.transfer_to_account.bank} - {order.transfer_to_account.account_number} a.n. {order.transfer_to_account.account_name}
                                    </Typography>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">-</Typography>
                                )}
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Status Pembayaran</Typography>
                                <Typography variant="body1">
                                    {order.payment_status_label}
                                </Typography>

                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Ongkir</Typography>
                                <Typography variant="body1">Rp {order.shipping_cost?.toLocaleString('id-ID') ?? '0'}</Typography>
                            </Grid>
                        </Grid>

                        {/* Alamat Pengiriman */}
                        {order.delivery_service_id !== 33 && order.delivery_address && (
                            <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Alamat Pengiriman</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2">
                                        {formatTitleCase(order.delivery_address.name)} - {order.delivery_address.phone}
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatTitleCase(order.delivery_address.address)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatTitleCase(order.delivery_address.subdistrict?.name)}, {formatTitleCase(order.delivery_address.district?.name)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatTitleCase(order.delivery_address.city?.name)}, {formatTitleCase(order.delivery_address.province?.name)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {order.delivery_address.postal_code?.postal_code}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Tabel Produk */}
                        <Typography variant="h6" sx={{ mb: 1 }}>Detail Produk</Typography>
                        <TableContainer sx={{ mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'background.paper' }}>
                                        <TableCell sx={{ color: 'text.primary' }}>Nama Produk</TableCell>
                                        <TableCell sx={{ color: 'text.primary' }}>Qty</TableCell>
                                        <TableCell sx={{ color: 'text.primary' }}>Harga Satuan</TableCell>
                                        <TableCell sx={{ color: 'text.primary' }}>Subtotal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.details.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.product_name}</TableCell>
                                            <TableCell>{item.quantity} {item.unit}</TableCell>
                                            <TableCell>Rp {item.unit_price?.toLocaleString('id-ID') ?? '-'}</TableCell>
                                            <TableCell>Rp {item.subtotal_price?.toLocaleString('id-ID') ?? '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* Total di bawah tabel */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <Box sx={{ minWidth: 220, bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">Total</Typography>
                                <Typography variant="h5" color="primary.main" fontWeight={700}>
                                    Rp {order.total?.toLocaleString('id-ID') ?? '-'}
                                </Typography>
                            </Box>
                        </Box>
                        {/* Tombol Upload Bukti Transfer */}
                        {order.payment_status_label === 'Belum dibayar' && (
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOpenUploadModal}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload Bukti Pembayaran
                                </Button>
                            </Box>
                        )}
                        {/* Bukti transfer & pengiriman */}
                        <Grid container spacing={2} sx={{ mb: 2 }} columns={{ xs: 12, md: 12 }}>
                            {order.image_payment && (
                                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">Bukti Pembayaran</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <img
                                            src={order.image_payment.startsWith('http') ? order.image_payment : `/storage/${order.image_payment}`}
                                            alt="Bukti Transfer"
                                            style={{
                                                width: '100%',
                                                maxWidth: 300,
                                                height: 'auto',
                                                borderRadius: 16,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            )}
                            {order.image_delivery && (
                                <Grid item sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">Bukti Pengiriman</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <img
                                            src={order.image_delivery.startsWith('http') ? order.image_delivery : `/storage/${order.image_delivery}`}
                                            alt="Bukti Pengiriman"
                                            style={{
                                                width: '100%',
                                                maxWidth: 300,
                                                height: 'auto',
                                                borderRadius: 16,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" onClick={() => router.visit('/transaction-history')}>Kembali ke Riwayat</Button>
                        </Box>
                    </Paper>
                </Box>

                {/* Upload Bukti Transfer Modal */}
                <Dialog
                    open={openUploadModal}
                    onClose={handleCloseUploadModal}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CloudUploadIcon /> Upload Bukti Transfer
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Silakan upload bukti transfer pembayaran Anda. Format yang didukung: JPG, PNG, JPEG. Maksimal ukuran file: 2MB.
                        </Alert>
                        <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
                            <InputLabel id="upload-transfer-account-label">Rekening Tujuan Transfer</InputLabel>
                            <Select
                                labelId="upload-transfer-account-label"
                                id="upload-transfer-account"
                                value={data.transfer_to_account_id}
                                label="Rekening Tujuan Transfer"
                                onChange={(e) => setData('transfer_to_account_id', e.target.value)}
                                disabled={processing}
                            >
                                <MenuItem value="">Pilih Rekening</MenuItem>
                                {transferToAccounts && transferToAccounts.map((acc) => (
                                    <MenuItem key={acc.id} value={acc.id}>
                                        {acc.bank?.name} - {acc.number} - {acc.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {order.delivery_service_id !== 33 && ( // Only show shipping cost if not COD (delivery_service_id 33)
                            <TextField
                                label="Biaya Pengiriman"
                                type="number"
                                fullWidth
                                size="small"
                                value={data.shipping_cost}
                                onChange={(e) => setData('shipping_cost', parseFloat(e.target.value))}
                                error={!!errors.shipping_cost}
                                helperText={errors.shipping_cost}
                                sx={{ mb: 2 }}
                            />
                        )}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                                startIcon={<ImageIcon />}
                                disabled={processing}
                            >
                                Pilih File
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {selectedFile && (
                                <Typography variant="body2" color="text.secondary">
                                    {selectedFile.name}
                                </Typography>
                            )}
                        </Box>
                        {previewUrl && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Preview:</Typography>
                                <Box sx={{
                                    width: '100%',
                                    maxWidth: 300,
                                    height: 200,
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseUploadModal} disabled={processing}>Batal</Button>
                        <Button
                            onClick={handleUpload}
                            variant="contained"
                            color="primary"
                            disabled={processing || !data.image_payment || !data.transfer_to_account_id}
                            startIcon={processing ? <CircularProgress size={20} /> : null}
                        >
                            {processing ? 'Mengupload...' : 'Upload'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar untuk notifikasi */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
        </AuthenticatedLayout>
    );
}
