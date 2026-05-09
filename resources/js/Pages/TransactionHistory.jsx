import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Typography, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { getDeliveryStatusColor, getPaymentStatusColor } from '@/Utils/statusUtils';

export default function OrderHistory({ auth, orders = [] }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Riwayat Pesanan" />

            <Box sx={{ py: 6, px: { xs: 2, md: 4 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" sx={{ fontWeight: '900', mb: 4, color: '#C6A96B', letterSpacing: '-1px' }}>
                        Riwayat Pesanan
                    </Typography>

                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 0, 
                            bgcolor: 'background.paper',
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden'
                        }}
                    >
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'rgba(198, 169, 107, 0.03)' }}>
                                        <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>NOMOR PESANAN</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>TANGGAL</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>PEMBAYARAN</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>PENGIRIMAN</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>TOTAL</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', pr: 4 }}>AKSI</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.length === 0 || (orders.data && orders.data.length === 0) ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                                <Typography color="text.secondary">Tidak ada riwayat pesanan.</Typography>
                                                <Button 
                                                    variant="text" 
                                                    onClick={() => router.visit(route('order.index'))}
                                                    sx={{ mt: 2, color: '#C6A96B', fontWeight: 'bold' }}
                                                >
                                                    Mulai Belanja Sekarang
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.data?.map((order) => (
                                            <TableRow key={order.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#C6A96B' }}>#{order.order_number}</TableCell>
                                                <TableCell sx={{ color: 'text.secondary' }}>{order.date}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={order.payment_status_label} 
                                                        sx={{ 
                                                            fontWeight: 'bold',
                                                            borderRadius: 1.5,
                                                            bgcolor: getPaymentStatusColor(order.payment_status_value) === 'success' ? 'success.dark' : 'warning.dark',
                                                            color: '#fff',
                                                            height: 28
                                                        }} 
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={order.delivery_status_label} 
                                                        sx={{ 
                                                            fontWeight: 'bold',
                                                            borderRadius: 1.5,
                                                            bgcolor: getDeliveryStatusColor(order.delivery_status_value) === 'success' ? 'success.dark' : 'warning.dark',
                                                            color: '#fff',
                                                            height: 28
                                                        }} 
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: '900' }}>Rp {order.total?.toLocaleString('id-ID') ?? '-'}</TableCell>
                                                <TableCell align="right" sx={{ pr: 4 }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => router.visit(route('order.show', order.id))}
                                                        sx={{
                                                            bgcolor: 'rgba(198, 169, 107, 0.1)',
                                                            color: '#C6A96B',
                                                            boxShadow: 'none',
                                                            fontWeight: 'bold',
                                                            borderRadius: 2,
                                                            '&:hover': {
                                                                bgcolor: '#C6A96B',
                                                                color: '#fff',
                                                                boxShadow: '0 4px 8px rgba(198, 169, 107, 0.3)'
                                                            }
                                                        }}
                                                    >
                                                        Lihat Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination Links */}
                        {orders.links && orders.links.length > 3 && (
                             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, bgcolor: 'rgba(0,0,0,0.01)', borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
                                 {orders.links.map((link, index) => (
                                     <Button
                                         key={index}
                                         onClick={() => router.visit(link.url)}
                                         disabled={!link.url}
                                         sx={{ 
                                             minWidth: 40,
                                             height: 40,
                                             borderRadius: 2,
                                             fontWeight: 'bold',
                                             color: link.active ? '#fff' : 'text.primary',
                                             background: link.active ? 'linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)' : 'transparent',
                                             borderColor: link.active ? 'transparent' : 'divider',
                                             '&:hover': {
                                                 background: link.active ? 'linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)' : 'rgba(198, 169, 107, 0.1)',
                                                 borderColor: '#C6A96B',
                                                 color: link.active ? '#fff' : '#C6A96B'
                                             }
                                         }}
                                         variant={link.active ? 'contained' : 'outlined'}
                                     >
                                         {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                     </Button>
                                 ))}
                             </Box>
                        )}
                    </Paper>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
