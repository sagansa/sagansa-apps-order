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
    <Card 
        elevation={0}
        sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: '#C6A96B',
                boxShadow: '0 10px 20px rgba(198, 169, 107, 0.1)'
            }
        }}
    >
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(198, 169, 107, 0.1)',
                    color: '#C6A96B',
                    display: 'flex'
                }}>
                    {IconComponent && <IconComponent size={24} />}
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: '900', color: 'text.primary' }}>
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
                <Box>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
                        Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255, 255, 255, 0.72)' }}>
                        Welcome back, {auth.user.name}
                    </Typography>
                </Box>
            }
        >
            <Head title="Dashboard" />

            <Box sx={{ py: 4, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        {/* Stats Section */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <StatCard 
                                    title="Total Pesanan" 
                                    value={stats.totalOrders} 
                                    icon={ShoppingCartIcon}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <StatCard 
                                    title="Sedang Diproses" 
                                    value={stats.pendingOrders} 
                                    icon={AccessTimeIcon}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <StatCard 
                                    title="Selesai" 
                                    value={stats.completedOrders} 
                                    icon={CheckCircleOutlineIcon}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                            {/* Order History Chart */}
                            <Grid size={{ xs: 12, lg: 8 }}>
                                <Card elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4 }}>
                                        Riwayat Pesanan (6 Bulan Terakhir)
                                    </Typography>
                                    {orderHistoryData && orderHistoryData.length > 0 ? (
                                        <Box sx={{ height: 350, mt: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={orderHistoryData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                                                    <Tooltip 
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                                        cursor={{ fill: 'rgba(198, 169, 107, 0.05)' }}
                                                    />
                                                    <Bar dataKey="orders" fill="#C6A96B" radius={[6, 6, 0, 0]} barSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    ) : (
                                        <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="body1" color="text.secondary">
                                                Tidak ada data riwayat pesanan.
                                            </Typography>
                                        </Box>
                                    )}
                                </Card>
                            </Grid>

                            {/* Frequently Ordered Products */}
                            <Grid size={{ xs: 12, lg: 4 }}>
                                <Card elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Produk Terlaris Anda
                                    </Typography>
                                    {frequentlyOrderedProducts && frequentlyOrderedProducts.length > 0 ? (
                                        <Stack spacing={2.5}>
                                            {frequentlyOrderedProducts.map((product) => (
                                                <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={product.image || '/images/no_image.png'}
                                                        sx={{ width: 56, height: 56, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                                                    />
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{product.order_count} Kali Dipesan</Typography>
                                                    </Box>
                                                    <Box sx={{ bgcolor: 'rgba(198, 169, 107, 0.1)', color: '#C6A96B', px: 1.5, py: 0.5, borderRadius: 1.5 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>FAV</Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Belum ada produk favorit.
                                            </Typography>
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Quick Actions */}
                        <Card elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', background: 'linear-gradient(rgba(198, 169, 107, 0.05), transparent)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        component={Link}
                                        href={route('order.index')}
                                        startIcon={<ShoppingCartIcon />}
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
                                        Mulai Belanja Sekarang
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        component={Link}
                                        href={route('transaction.history')}
                                        startIcon={<VisibilityIcon />}
                                        sx={{
                                            py: 2,
                                            borderRadius: 2,
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            borderColor: '#C6A96B',
                                            color: '#C6A96B',
                                            '&:hover': {
                                                borderColor: '#D4AF37',
                                                bgcolor: 'rgba(198, 169, 107, 0.05)',
                                            }
                                        }}
                                    >
                                        Lihat Riwayat Transaksi
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
