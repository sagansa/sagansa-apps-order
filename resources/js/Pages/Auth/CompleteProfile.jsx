import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    TextField, Button, Box, Typography, Container, Paper, Stack, Divider, Alert
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function CompleteProfile() {
    const { auth } = usePage().props;
    const [isWaClicked, setIsWaClicked] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        phone_number: '',
    });

    const adminPhone = '628111923572'; // Ganti dengan nomor Admin Sagansa (format 62...)

    const handleVerifyWA = () => {
        if (!data.phone_number) {
            alert('Silakan masukkan nomor telepon terlebih dahulu.');
            return;
        }

        const message = encodeURIComponent(
            `Halo Sagansa, saya ingin memverifikasi nomor WhatsApp saya.\n\n` +
            `Nama: ${auth.user.name}\n` +
            `Email: ${auth.user.email}\n` +
            `Nomor WA: ${data.phone_number}`
        );
        
        window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
        setIsWaClicked(true);
    };

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
                        Langkah Terakhir
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, color: '#A0A0A0', textAlign: 'center' }}>
                        Demi keamanan dan kelancaran pengiriman, mohon lengkapi nomor WhatsApp Anda.
                    </Typography>

                    <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                        <Stack spacing={3}>
                            <TextField
                                required
                                fullWidth
                                id="phone_number"
                                label="Nomor WhatsApp"
                                name="phone_number"
                                placeholder="Contoh: 08123456789"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                error={!!errors.phone_number}
                                helperText={errors.phone_number || "Gunakan nomor yang aktif di WhatsApp"}
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

                            <Divider sx={{ borderColor: '#333333' }}>
                                <Typography variant="caption" sx={{ color: '#444444', px: 1 }}>VERIFIKASI</Typography>
                            </Divider>

                            {!isWaClicked ? (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleVerifyWA}
                                    startIcon={<WhatsAppIcon />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: '700',
                                        borderColor: '#25D366',
                                        color: '#25D366',
                                        '&:hover': { 
                                            borderColor: '#128C7E', 
                                            backgroundColor: 'rgba(37, 211, 102, 0.05)' 
                                        }
                                    }}
                                >
                                    Verifikasi via WhatsApp (Gratis)
                                </Button>
                            ) : (
                                <Alert 
                                    severity="success" 
                                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                                    sx={{ 
                                        backgroundColor: 'rgba(37, 211, 102, 0.1)', 
                                        color: '#25D366',
                                        borderRadius: 2,
                                        '& .MuiAlert-icon': { color: '#25D366' }
                                    }}
                                >
                                    Terima kasih! Pastikan Anda sudah mengirim pesan verifikasi di WhatsApp.
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={processing || (!isWaClicked && !data.phone_number)}
                                sx={{ 
                                    mt: 2,
                                    py: 1.8,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    backgroundColor: isWaClicked ? '#C5A059' : '#333333',
                                    color: '#000000',
                                    boxShadow: isWaClicked ? '0 4px 15px rgba(197, 160, 89, 0.4)' : 'none',
                                    '&:hover': { 
                                        backgroundColor: isWaClicked ? '#D4AF37' : '#444444',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Simpan dan Lanjutkan
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
