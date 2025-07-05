import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Box, TextField, Button, Typography, Stack, Alert } from '@mui/material'; // Import MUI components
import MuiLink from '@mui/material/Link'; // Import MUI Link for consistency

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Box component="section">
            <Box component="header" sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    Profile Information
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Update your account's profile information and email address.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={submit}
                sx={{ mt: 4 }}
            >
                    <Stack spacing={3}>
                        <TextField
                            id="name"
                            label="Name"
                            // variant="filled" // Use outlined variant for better appearance
                            fullWidth
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                            autoComplete="name"
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent', // Remove blue border on focus
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: 'text.primary', // Keep label color consistent or default
                                },
                            }}
                        />

                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            variant="filled" // Use outlined variant for better appearance
                            fullWidth
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={{
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent', // Remove blue border on focus
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: 'text.primary', // Keep label color consistent or default
                                },
                            }}
                        />
                </Stack>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ mt: 2, color: 'text.primary' }}>
                            Your email address is unverified.
                            <MuiLink
                                component={Link}
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                sx={{
                                    ml: 1,
                                    color: 'primary.main',
                                    textDecoration: 'underline',
                                    '&:hover': { textDecoration: 'underline', color: 'primary.dark' },
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Click here to re-send the verification email.
                            </MuiLink>
                        </Typography>

                        {status === 'verification-link-sent' && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                A new verification link has been sent to your email address.
                            </Alert>
                        )}
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
                    <Button variant="contained" disabled={processing}>Save</Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <Typography variant="body2" color="text.secondary">
                            Saved.
                        </Typography>
                    </Transition>
                </Box>
            </Box>
        </Box>
    );
}
