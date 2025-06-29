import BaseLayout from '@/Layouts/BaseLayout';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children, primaryColor, secondaryColor }) {
    const user = usePage().props.auth.user;

    return (
            <BaseLayout
                children={children}
                header={header}
                isAuthenticated={true}
                user={user}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />
    );
}
