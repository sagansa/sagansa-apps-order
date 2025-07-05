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
            <Head title="Register" />

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
                    <ApplicationLogo sx={{ mb: 1, width: 60, height: 60 }} />
                    <Typography component="h1" variant="h5">
                        Create an Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Get started with us today!
                    </Typography>

                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <TextField
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            variant="outlined"
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
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            variant="outlined"
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
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            variant="outlined"
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
                            name="password_confirmation"
                            label="Confirm Password"
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
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent',
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: 'text.primary',
                                },
                            }}
                        />
                    </Stack>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={processing}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <MuiLink component={Link} href={route('login')} variant="body2">
                                Already have an account? Sign in
                            </MuiLink>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
