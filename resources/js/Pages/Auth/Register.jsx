import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    TextField, Button, Box, Typography, Container, Paper, Stack, Grid
} from '@mui/material';
import MuiLink from '@mui/material/Link'; // Import MUI Link for consistent styling

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

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
                        Buat Akun
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, color: '#A0A0A0' }}>
                        Daftar sekarang untuk mulai berbelanja di SAGANSA.
                    </Typography>

                    <Stack spacing={2.5} sx={{ width: '100%' }}>
                        <TextField
                            required
                            fullWidth
                            id="name"
                            label="Nama Lengkap"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
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
                            autoComplete="new-password"
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

                        <TextField
                            required
                            fullWidth
                            name="password_confirmation"
                            label="Konfirmasi Kata Sandi"
                            type="password"
                            id="password_confirmation"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
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
                    </Stack>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={processing}
                        sx={{ 
                            mt: 5, 
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
                        Daftar Sekarang
                    </Button>

                    <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                        Sudah punya akun?{' '}
                        <MuiLink 
                            component={Link} 
                            href={route('login')} 
                            variant="body2"
                            sx={{ color: '#C5A059', fontWeight: '600', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Masuk di sini
                        </MuiLink>
                    </Typography>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
