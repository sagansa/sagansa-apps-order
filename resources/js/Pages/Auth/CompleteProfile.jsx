import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    TextField, Button, Box, Typography, Container, Paper, Stack
} from '@mui/material';

export default function CompleteProfile() {
    const { data, setData, post, processing, errors } = useForm({
        phone_number: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('complete-profile.update'));
    };

    return (
        <GuestLayout>
            <Head title="Lengkapi Profil" />

            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        mt: 8,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#1A1A1A',
                        borderRadius: 4,
                        border: '1px solid #333333',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                    }}
                >
                    <Typography component="h1" variant="h4" sx={{ fontWeight: '900', color: '#C5A059', mb: 1, textAlign: 'center' }}>
                        Lengkapi Profil
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, color: '#A0A0A0', textAlign: 'center' }}>
                        Nomor telepon bersifat opsional dan dapat membantu komunikasi pesanan.
                    </Typography>

                    <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                id="phone_number"
                                label="Nomor Telepon (Opsional)"
                                name="phone_number"
                                placeholder="Contoh: 08123456789"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                error={!!errors.phone_number}
                                helperText={errors.phone_number || 'Boleh dikosongkan.'}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        color: '#FFFFFF',
                                        '& fieldset': { borderColor: '#444444' },
                                        '&:hover fieldset': { borderColor: '#C5A059' },
                                        '&.Mui-focused fieldset': { borderColor: '#C5A059' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#888888' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#C5A059' },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={processing}
                                sx={{
                                    py: 1.8,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    backgroundColor: '#C5A059',
                                    color: '#000000',
                                    boxShadow: '0 4px 15px rgba(197, 160, 89, 0.4)',
                                    '&:hover': {
                                        backgroundColor: '#D4AF37',
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#444444',
                                        color: '#888888',
                                        boxShadow: 'none',
                                    },
                                }}
                            >
                                Simpan dan Lanjutkan
                            </Button>

                            <Button
                                component={Link}
                                href={route('dashboard')}
                                fullWidth
                                variant="text"
                                sx={{
                                    color: '#A0A0A0',
                                    textTransform: 'none',
                                    '&:hover': {
                                        color: '#C5A059',
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                Lewati
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
