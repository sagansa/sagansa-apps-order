import { Link } from '@inertiajs/react';
import { List, ListItem, ListItemText } from '@mui/material';

export default function MenuItems({ isAuthenticated, onItemClick }) {
    const commonItems = [
        { text: 'Order', href: route('order.index') }
    ];

    const guestItems = [
        { text: 'Login', href: route('login') },
        { text: 'Register', href: route('register') }
    ];

    const authenticatedItems = [
        { text: 'Dashboard', href: route('dashboard') },
        { text: 'Profile', href: route('profile.edit') },
        { text: 'Transaction History', href: route('transaction.history') }
    ];

    const items = [
        ...commonItems,
        ...(isAuthenticated ? authenticatedItems : guestItems)
    ];

    return (
        <List>
            {items.map((item) => (
                <ListItem
                    key={item.text}
                    component={Link}
                    href={item.href}
                    onClick={onItemClick}
                    sx={{
                        color: 'text.primary',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                >
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
            {isAuthenticated && (
                <ListItem
                    component="button"
                    onClick={(e) => {
                        e.preventDefault();
                        onItemClick();
                        router.post(route('logout'));
                    }}
                    sx={{
                        color: 'text.primary',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                >
                    <ListItemText primary="Log Out" />
                </ListItem>
            )}
        </List>
    );
}
