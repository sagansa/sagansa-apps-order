import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, Container, Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';

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
        <ThemeProvider theme={theme}>
            <GuestLayout>
                <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

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
                    {status && (
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                            {status}
                        </Alert>
                    )}

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Remember me"
                    />

                    <Box sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                    Lupa password?
                                </Link>
                            )}
                            <Link
                                href={route('register')}
                                className="text-sm text-indigo-600 hover:text-indigo-700"
                            >
                                Belum punya akun? Daftar
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Masuk
                        </Button>
                    </Box>
                </Box>
            </Container>
            </GuestLayout>
        </ThemeProvider>
    );
}
