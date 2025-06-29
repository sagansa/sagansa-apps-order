import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Box, Container, Typography, Grid, Paper, Stack, Card, CardContent, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar
} from '@mui/material';
import {
    ShoppingCart as ShoppingCartIcon,
    AccessTime as AccessTimeIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    ListAlt as ListAltIcon,
    Visibility as VisibilityIcon,
    History as HistoryIcon,
    FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: IconComponent }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {IconComponent && <IconComponent color="primary" sx={{ mr: 1 }} />}
            <Typography variant="subtitle1" color="text.secondary">
                {title}
            </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
        </Typography>
        </CardContent>
    </Card>
);

export default function Dashboard({ auth, stats, recentOrders, lastOrderDate, orderHistoryData, frequentlyOrderedProducts }) {
    // Format last order date
    const formattedLastOrderDate = lastOrderDate ? dayjs(lastOrderDate).format('DD MMMM YYYY') : 'Belum ada pesanan';

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                    Dashboard
                </Typography>
            }
        >
            <Head title="Dashboard" />

            <Box sx={{ py: 4 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        {/* Welcome Section */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Selamat Datang, {auth.user.name}!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Ini adalah ringkasan aktivitas Anda.
                            </Typography>
                        </Paper>

                        {/* Stats Section */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <StatCard title="Total Pesanan" value={stats.totalOrders} icon={ShoppingCartIcon} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <StatCard title="Pesanan Diproses" value={stats.pendingOrders} icon={AccessTimeIcon} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <StatCard title="Pesanan Selesai" value={stats.completedOrders} icon={CheckCircleOutlineIcon} />
                            </Grid>
                        </Grid>

                        {/* Last Order Date */}
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <HistoryIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" color="text.secondary">
                                    Terakhir Pesan
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {formattedLastOrderDate}
                            </Typography>
                        </Paper>

                        {/* Order History Chart */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Riwayat Pesanan (Per Bulan)
                            </Typography>
                            {orderHistoryData && orderHistoryData.length > 0 ? (
                                <Box sx={{ height: 300, mt: 2 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={orderHistoryData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="orders" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            ) : (
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
                                    Tidak ada data riwayat pesanan untuk ditampilkan.
                                </Typography>
                            )}
                        </Paper>

                        {/* Frequently Ordered Products */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Produk Sering Dipesan
                            </Typography>
                            {frequentlyOrderedProducts && frequentlyOrderedProducts.length > 0 ? (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Produk</TableCell>
                                                <TableCell align="right">Jumlah Pesanan</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {frequentlyOrderedProducts.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Avatar
                                                                variant="rounded"
                                                                src={product.image || '/images/no_image.png'}
                                                                sx={{ width: 40, height: 40 }}
                                                            />
                                                            <Typography variant="body1">{product.name}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body1">{product.order_count}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
                                    Tidak ada produk yang sering dipesan.
                                </Typography>
                            )}
                        </Paper>




                        {/* Quick Actions */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Tindakan Cepat
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        component={Link}
                                        href={route('order.index')}
                                        startIcon={<ShoppingCartIcon />}
                                    >
                                        Mulai Belanja
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        component={Link}
                                        href={route('transaction.history')}
                                        startIcon={<VisibilityIcon />}
                                    >
                                        Lihat Riwayat Transaksi
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Stack>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
