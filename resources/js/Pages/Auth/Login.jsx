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
            <Head title="Log in" />

            <Container component="main" maxWidth="xs">
                <Paper
                    component="form"
                    onSubmit={submit}
                    sx={{
                        mt: 8,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <ApplicationLogo sx={{ mb: 1, width: 60, height: 60 }} /> {/* Smaller logo */}
                    <Typography component="h1" variant="h5">
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}> {/* Reduced margin */}
                        Sign in to continue
                    </Typography>

                    {status && (
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                            {status}
                        </Alert>
                    )}

                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <TextField
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
                            // variant="filled"
                            sx={{
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent',
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: 'text.primary',
                                },
                            }}
                        />

                        <TextField
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
                            // variant="filled"
                            sx={{
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent',
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: 'text.primary',
                                },
                            }}
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
                    </Stack>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={processing}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>

                    <Grid container justifyContent="space-between">
                        <Grid>
                            {canResetPassword && (
                                <MuiLink component={Link} href={route('password.request')} variant="body2">
                                    Forgot password?
                                </MuiLink>
                            )}
                        </Grid>
                        <Grid>
                            <MuiLink component={Link} href={route('register')} variant="body2">
                                {"Don't have an account? Sign Up"}
                            </MuiLink>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
