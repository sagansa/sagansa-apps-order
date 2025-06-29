import BaseLayout from '@/Layouts/BaseLayout';

export default function GuestLayout({ children }) {
    return (
        <BaseLayout
            children={children}
            isAuthenticated={false}
        />
    );
}
