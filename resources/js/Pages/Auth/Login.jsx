import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    TextField, Button, Checkbox, FormControlLabel, Box, Typography,
    Container, Alert, Paper, Stack, Grid, Divider
} from '@mui/material';
import MuiLink from '@mui/material/Link'; // Import MUI Link for consistent styling

export default function Login({ status, canResetPassword }) {
    const [showManual, setShowManual] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <Container component="main" maxWidth="xs">
                <Paper
                    component="form"
                    onSubmit={submit}
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
                    <Typography component="h1" variant="h4" sx={{ fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.05em' }}>
                        Selamat Datang
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, color: '#A0A0A0', textAlign: 'center' }}>
                        Masuk lebih cepat dan aman dengan akun Google Anda.
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        component="a"
                        href={route('google.login')}
                        sx={{
                            mb: showManual ? 4 : 2,
                            py: 1.8,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: '700',
                            fontSize: '1rem',
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            boxShadow: '0 4px 12px rgba(255,255,255,0.1)',
                            '&:hover': { 
                                backgroundColor: '#F5F5F5', 
                                boxShadow: '0 6px 20px rgba(255,255,255,0.2)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            gap: 2
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Masuk dengan Google
                    </Button>

                    {!showManual ? (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <MuiLink
                                component="button"
                                type="button"
                                onClick={() => setShowManual(true)}
                                sx={{ 
                                    color: '#666666', 
                                    fontSize: '0.8rem', 
                                    textDecoration: 'none',
                                    '&:hover': { color: '#C5A059' }
                                }}
                            >
                                Atau gunakan opsi email manual
                            </MuiLink>
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <Divider sx={{ mb: 4, borderColor: '#333333' }}>
                                <Typography variant="caption" sx={{ color: '#444444', px: 1 }}>OPSI MANUAL</Typography>
                            </Divider>

                            <Stack spacing={2.5}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Alamat Email"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    variant="outlined"
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

                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Kata Sandi"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    variant="outlined"
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
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                sx={{ color: '#444444', '&.Mui-checked': { color: '#C5A059' } }}
                                            />
                                        }
                                        label={<Typography variant="body2" sx={{ color: '#A0A0A0' }}>Ingat saya</Typography>}
                                    />
                                    {canResetPassword && (
                                        <MuiLink 
                                            component={Link} 
                                            href={route('password.request')} 
                                            variant="body2"
                                            sx={{ color: '#C5A059', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            Lupa kata sandi?
                                        </MuiLink>
                                    )}
                                </Box>
                            </Stack>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={processing}
                                sx={{ 
                                    mt: 4, 
                                    mb: 3, 
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
                                Masuk Sekarang
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#666666' }}>
                            Belum punya akun?{' '}
                            <MuiLink 
                                component={Link} 
                                href={route('register')} 
                                variant="body2"
                                sx={{ color: '#C5A059', fontWeight: '600', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Daftar Gratis
                            </MuiLink>
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#666666', lineHeight: 1.6 }}>
                            Dengan melanjutkan, Anda menyetujui <br />
                            <MuiLink component={Link} href={route('terms.service')} sx={{ color: '#C5A059', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Syarat & Ketentuan</MuiLink>
                            {' '} & {' '}
                            <MuiLink component={Link} href={route('privacy.policy')} sx={{ color: '#C5A059', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Kebijakan Privasi</MuiLink>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
