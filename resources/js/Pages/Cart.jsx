import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, IconButton, Box, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ErrorBoundary from '@/Components/ErrorBoundary';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast } from 'react-hot-toast';

export default function Cart({ auth, cart_items }) {
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleUpdateQuantity = (cartId, newQuantity) => {
        if (newQuantity < 1) return;

        router.put(route('cart.update', cartId), { quantity: newQuantity }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Quantity berhasil diperbarui');
            },
            onError: (errors) => {
                toast.error(errors.message || 'Gagal memperbarui quantity');
            }
        });
    };

    const handleDelete = (cartId) => {
        router.delete(route('cart.destroy', cartId), {
            preserveScroll: true,
            onSuccess: () => {
                setSnackbarMessage('Item berhasil dihapus dari keranjang');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            },
            onError: (errors) => {
                setSnackbarMessage(errors.message || 'Gagal menghapus item');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Shopping Cart</h2>
                </div>
            }
        >
            <Head title="Cart" />
            <ErrorBoundary>
            <div className="py-12">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Shopping Cart
                </Typography>

                {cart_items && cart_items.length > 0 ? (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            {cart_items.map((item) => (
                                <Card key={item.id} sx={{ display: 'flex', mb: 2 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 151 }}
                                        image={item.image}
                                        alt={item.name}
                                    />
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography component="h5" variant="h6">
                                            {item.product.name}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Rp {item.product.online_price ? item.product.online_price.toLocaleString() : '0'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                            <IconButton
                                                sx={{ ml: 'auto' }}
                                                color="error"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Order Summary
                                    </Typography>
                                    <Typography variant="body1">
                                        Total Items: {cart_items.reduce((sum, item) => sum + item.quantity, 0)}
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                        Total: Rp {cart_items.reduce((sum, item) => sum + (item.product.online_price * item.quantity || 0), 0).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Your cart is empty
                    </Typography>
                )}
            </Container>
            </div>
            </ErrorBoundary>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </AuthenticatedLayout>
    );
}
