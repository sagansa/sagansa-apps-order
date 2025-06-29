import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Box, Container, Paper, Typography, Stack } from '@mui/material'; // Import MUI components

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                    Profile
                </Typography>
            }
        >
            <Head title="Profile" />

            <Box sx={{ py: 4 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Paper sx={{ p: 3 }}>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <UpdatePasswordForm />
                        </Paper>
                    </Stack>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
