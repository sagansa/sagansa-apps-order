import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button, Menu, MenuItem, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function UserMenu({ user, isAuthenticated }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!isAuthenticated) {
        return (
            <>
                <Button
                    color="inherit"
                    onClick={handleMenu}
                    sx={{
                        ml: 2,
                        textTransform: 'none',
                        color: 'inherit',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)'
                        }
                    }}
                >
                    Guest
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            bgcolor: 'background.paper',
                            color: 'text.primary'
                        }
                    }}
                >
                    <MenuItem
                        component={Link}
                        href={route('login')}
                        onClick={handleClose}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        Login
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        href={route('register')}
                        onClick={handleClose}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        Register
                    </MenuItem>
                </Menu>
            </>
        );
    }

    return (
        <>
            <IconButton
                color="inherit"
                component={Link}
                href={route('cart.index')}
                sx={{
                    mr: 2,
                    color: 'inherit',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)'
                    }
                }}
            >
                <Badge
                    badgeContent={user.cart_count || 0}
                    color="error"
                    showZero
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.75rem',
                            height: '20px',
                            minWidth: '20px',
                            padding: '0 4px',
                            zIndex: 1,
                            transform: 'scale(1) translate(50%, -50%)',
                        }
                    }}
                >
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            <Button
                color="inherit"
                onClick={handleMenu}
                sx={{
                    ml: 2,
                    textTransform: 'none',
                    color: 'inherit',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)'
                    }
                }}
            >
                {user.name}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                        color: 'text.primary'
                    }
                }}
            >
                <MenuItem
                    component={Link}
                    href={route('profile.edit')}
                    onClick={handleClose}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                >
                    Profile
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        handleClose();
                        router.post(route('logout'));
                    }}
                    as="button"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                >
                    Log Out
                </MenuItem>
            </Menu>
        </>
    );
}
