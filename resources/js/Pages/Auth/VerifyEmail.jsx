import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    Button, Box, Typography, Container, Alert, Paper
} from '@mui/material';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    useEffect(() => {
        const pollInterval = setInterval(() => {
            router.reload({ preserveScroll: true });
        }, 5000);

        return () => clearInterval(pollInterval);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

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
                    <ApplicationLogo sx={{ mb: 2, width: 70, height: 70 }} />
                    <Typography component="h1" variant="h4" sx={{ fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.05em', textAlign: 'center' }}>
                        Verifikasi Email
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mt: 2, mb: 4, color: '#A0A0A0', textAlign: 'center', lineHeight: 1.6 }}>
                        Terima kasih telah mendaftar! Sebelum memulai, harap verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan. Jika Anda tidak menerimanya, kami akan mengirimkan tautan baru.
                    </Typography>

                    {status === 'verification-link-sent' && (
                        <Alert severity="success" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                            Tautan verifikasi baru telah dikirim ke email Anda.
                        </Alert>
                    )}

                    <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={processing}
                            sx={{ 
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: '700',
                                backgroundColor: '#C5A059',
                                color: '#000000',
                                boxShadow: 'none',
                                '&:hover': { backgroundColor: '#D4AF37', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.4)' },
                                '&:disabled': { backgroundColor: '#444444', color: '#888888' }
                            }}
                        >
                            Kirim Ulang Email Verifikasi
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                style={{ color: '#888888', textDecoration: 'underline', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Keluar
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
