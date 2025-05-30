import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';

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
            <Head title="Register" />

            <Container component="main" maxWidth="sm">
                <Box
                    component="form"
                    onSubmit={submit}
                    sx={{
                        mt: 1,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Daftar Akun
                    </Typography>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nama"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        margin="normal"
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
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password_confirmation"
                        label="Konfirmasi Password"
                        type="password"
                        id="password_confirmation"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
                    />

                    <Box sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                        <Link
                            href={route('login')}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                            Sudah punya akun? Masuk
                        </Link>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Daftar
                        </Button>
                    </Box>
                </Box>
            </Container>
        </GuestLayout>
    );
}
