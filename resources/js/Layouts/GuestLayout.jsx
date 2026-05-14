import BaseLayout from '@/Layouts/BaseLayout';

export default function GuestLayout({ children, user, header }) {
    return (
        <BaseLayout
            children={children}
            header={header}
            isAuthenticated={false}
            user={user}
        />
    );
}
