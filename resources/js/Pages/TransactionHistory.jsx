import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Typography, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Card, CardContent, Divider, Stack } from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { getDeliveryStatusColor, getPaymentStatusBgColor } from '@/Utils/statusUtils';

function OrderCard({ order }) {
    return (
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 2 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#C6A96B', fontSize: '0.95rem' }}>
                        #{order.order_number}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {order.date}
                    </Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Pembayaran</Typography>
                        <Chip 
                            label={order.payment_status_label} 
                            sx={{ 
                                fontWeight: 'bold',
                                borderRadius: 1.5,
                                bgcolor: getPaymentStatusBgColor(order.payment_status_value),
                                color: '#fff',
                                height: 24,
                                fontSize: '0.75rem'
                            }} 
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Pengiriman</Typography>
                        <Chip 
                            label={order.delivery_status_label} 
                            sx={{ 
                                fontWeight: 'bold',
                                borderRadius: 1.5,
                                bgcolor: getDeliveryStatusColor(order.delivery_status_value) === 'success' ? 'success.dark' : 'warning.dark',
                                color: '#fff',
                                height: 24,
                                fontSize: '0.75rem'
                            }} 
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Total</Typography>
                        <Typography sx={{ fontWeight: '900', fontSize: '1rem' }}>
                            Rp {order.total?.toLocaleString('id-ID') ?? '-'}
                        </Typography>
                    </Box>
                </Stack>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => router.visit(`/transaction-detail/${order.id}`)}
                    sx={{
                        mt: 2,
                        bgcolor: 'rgba(198, 169, 107, 0.1)',
                        color: '#C6A96B',
                        boxShadow: 'none',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        py: 1,
                        '&:hover': {
                            bgcolor: '#C6A96B',
                            color: '#fff',
                            boxShadow: '0 4px 8px rgba(198, 169, 107, 0.3)'
                        }
                    }}
                >
                    Lihat Detail
                </Button>
            </CardContent>
        </Card>
    );
}

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;
    const prev = links[0];
    const next = links[links.length - 1];

    return (
        <>
            {/* Mobile: prev/next only */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', gap: 2, py: 3, px: 2, bgcolor: 'rgba(0,0,0,0.01)', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                    onClick={() => router.visit(prev.url)}
                    disabled={!prev.url}
                    variant="outlined"
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        borderColor: 'divider',
                        '&:hover': {
                            borderColor: '#C6A96B',
                            color: '#C6A96B'
                        }
                    }}
                >
                    « Sebelumnya
                </Button>
                <Button
                    onClick={() => router.visit(next.url)}
                    disabled={!next.url}
                    variant="outlined"
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        borderColor: 'divider',
                        '&:hover': {
                            borderColor: '#C6A96B',
                            color: '#C6A96B'
                        }
                    }}
                >
                    Selanjutnya »
                </Button>
            </Box>

            {/* Desktop: full pagination with page numbers */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', py: 3, px: 2, bgcolor: 'rgba(0,0,0,0.01)', borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
                {links.map((link, index) => {
                    const isPrev = index === 0;
                    const isNext = index === links.length - 1;
                    const isPageNum = !isPrev && !isNext;
                    const label = link.label
                        .replace('&laquo;', '')
                        .replace('&raquo;', '')
                        .replace('Previous', '')
                        .replace('Next', '')
                        .trim();

                    return (
                        <Button
                            key={index}
                            onClick={() => router.visit(link.url)}
                            disabled={!link.url}
                            sx={{ 
                                minWidth: isPageNum ? 40 : 'auto',
                                height: 40,
                                px: isPageNum ? 1 : 2,
                                borderRadius: 2,
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                color: link.active ? '#fff' : 'text.primary',
                                background: link.active ? 'linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)' : 'transparent',
                                border: 1,
                                borderColor: link.active ? 'transparent' : 'divider',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                    background: link.active ? 'linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)' : 'rgba(198, 169, 107, 0.1)',
                                    borderColor: '#C6A96B',
                                    color: link.active ? '#fff' : '#C6A96B'
                                }
                            }}
                            variant={link.active ? 'contained' : 'outlined'}
                        >
                            {isPrev ? '« Sebelumnya' : isNext ? 'Selanjutnya »' : label}
                        </Button>
                    );
                })}
            </Box>
        </>
    );
}

export default function OrderHistory({ auth, orders = [] }) {
    const isEmpty = orders.length === 0 || (orders.data && orders.data.length === 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Box>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
                        Riwayat Pesanan
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255, 255, 255, 0.72)' }}>
                        Daftar pesanan yang pernah Anda buat
                    </Typography>
                </Box>
            }
        >
            <Head title="Riwayat Pesanan" />

            <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
                <Container maxWidth="lg">

                    {/* Mobile: card view */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        {isEmpty ? (
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <Typography color="text.secondary" sx={{ mb: 2 }}>Tidak ada riwayat pesanan.</Typography>
                                <Button 
                                    variant="text" 
                                    onClick={() => router.visit(route('order.index'))}
                                    sx={{ color: '#C6A96B', fontWeight: 'bold' }}
                                >
                                    Mulai Belanja Sekarang
                                </Button>
                            </Box>
                        ) : (
                            <>
                                {orders.data?.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                                <Pagination links={orders.links} />
                            </>
                        )}
                    </Box>

                    {/* Desktop: table view */}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
                                <Table>
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
                                        {isEmpty ? (
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
                                                                bgcolor: getPaymentStatusBgColor(order.payment_status_value),
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
                                                            onClick={() => router.visit(`/transaction-detail/${order.id}`)}
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
                            <Pagination links={orders.links} />
                        </Paper>
                    </Box>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
