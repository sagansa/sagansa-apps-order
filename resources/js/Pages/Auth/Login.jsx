import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    TextField, Button, Checkbox, FormControlLabel, Box, Typography,
    Container, Alert, Paper, Stack, Grid
} from '@mui/material';
import MuiLink from '@mui/material/Link'; // Import MUI Link for consistent styling

export default function Login({ status, canResetPassword }) {
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
                    <Typography variant="body2" sx={{ mb: 4, color: '#A0A0A0' }}>
                        Silakan masuk untuk melanjutkan pesanan Anda.
                    </Typography>

                    {status && (
                        <Alert severity="success" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                            {status}
                        </Alert>
                    )}

                    <Stack spacing={3} sx={{ width: '100%' }}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Alamat Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
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

                    <Grid container direction="column" alignItems="center" spacing={1}>
                        <Grid item>
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
                        </Grid>
                        <Grid item sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
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
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
