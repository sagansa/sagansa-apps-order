import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, usePage } from '@inertiajs/react';

const statusColor = (statusLabel) => {
    switch (statusLabel) {
        case 'Sudah dikirim':
        case 'Dibayar':
            return 'success'; // Green for completed/positive states
        case 'Perbaiki':
        case 'Dikembalikan':
        case 'Tidak valid':
        case 'Belum dibayar':
            return 'error'; // Red for negative/problematic states
        case 'Belum dikirim':
        case 'Siap dikirim':
        case 'Diproses':
            return 'warning'; // Orange for pending/in-progress states
        case 'Belum diperiksa':
        case 'Valid':
            return 'info'; // Blue for informational/neutral states
        default:
            return 'default'; // Grey for unknown or default states
    }
};

export default function OrderHistory({ auth, orders = [] }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                Riwayat Pesanan
            </Typography>}
        >
                <Head title="Transaction History" />

                <Box sx={{ py: 4, px: { xs: 1, md: 4 } }}>
                    <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No. Pesanan</TableCell>
                                        <TableCell>Tanggal</TableCell>
                                        <TableCell>Status Pembayaran</TableCell>
                                        <TableCell>Status Pengiriman</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell align="center">Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                Tidak ada riwayat pesanan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.data && orders.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    Tidak ada riwayat pesanan.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            orders.data?.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>{order.order_number}</TableCell>
                                                    <TableCell>{order.date}</TableCell>
                                                    <TableCell>
                                                        <Chip label={order.payment_status} color={statusColor(order.payment_status)} size="small" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={order.delivery_status} color={statusColor(order.delivery_status)} size="small" />
                                                    </TableCell>
                                                    <TableCell>Rp {order.total?.toLocaleString('id-ID') ?? '-'}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => router.visit(route('order.show', order.id))}
                                                        >
                                                            Detail
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination Links */}
                        {orders.links && orders.links.length > 3 && ( // Render pagination if there are links (more than just prev/next disabled on first/last page) and more than one page (total > per_page)
                             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
                                 {orders.links.map((link, index) => (
                                     <Button
                                         key={index}
                                         onClick={() => router.visit(link.url)}
                                         disabled={!link.url} // Disable if url is null (prev/next on first/last page)
                                         variant={link.active ? 'contained' : 'outlined'}
                                         size="small"
                                         sx={{ minWidth: 32, px: 1.5 }} // Styling untuk tombol paginasi
                                     >
                                         {/* Render label, tangani &laquo;/&raquo; */}
                                         {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                     </Button>
                                 ))}
                             </Box>
                        )}

                    </Paper>
                </Box>
        </AuthenticatedLayout>
    );
}
