import BaseLayout from '@/Layouts/BaseLayout';

export default function GuestLayout({ children, user }) {
    return (
        <BaseLayout
            children={children}
            isAuthenticated={false}
            user={user}
        />
    );
}
