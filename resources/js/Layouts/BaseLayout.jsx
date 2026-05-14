import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Box,
    Container,
    Typography,
    Drawer,
    CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuItems from "@/Components/Layout/MenuItems";
import UserMenu from "@/Components/Layout/UserMenu";
import { primaryGreen, secondaryGreen, brandBlack, brandGold } from "@/constants/colors";

export default function BaseLayout({
    children,
    header,
    isAuthenticated,
    user,
    primaryColor,
    secondaryColor,
    ...rest
}) {
    const [mode, setMode] = useState("dark");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMode("dark"); // Force dark mode
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    useEffect(() => {
        if (isAuthenticated && user && !user.email_verified_at) {
            const pollInterval = setInterval(() => {
                import('@inertiajs/react').then(({ router }) => {
                    router.reload({ 
                        only: ['auth'],
                        preserveScroll: true,
                        preserveState: true
                    });
                });
            }, 10000);

            return () => clearInterval(pollInterval);
        }
    }, [isAuthenticated, user?.email_verified_at]);


    const theme = useMemo(() => {
        const actualMode = mode === "dark" ? "dark" : "light";
        return createTheme({
            palette: {
                mode: actualMode,
                primary: {
                    main: typeof primaryColor === 'string' ? primaryColor : "#C6A96B",
                    contrastText: "#0A0A0A",
                },
                secondary: {
                    main: typeof secondaryColor === 'string' ? secondaryColor : "#0A0A0A",
                    contrastText: "#FFFFFF",
                },
                background: {
                    default: actualMode === "light" ? "#f5f5f5" : "#0A0A0A",
                    paper: actualMode === "light" ? "#ffffff" : "#141414",
                },
                text: {
                    primary: actualMode === "light" ? "#0A0A0A" : "#ffffff",
                    secondary: actualMode === "light" ? "#666666" : "#999999",
                },
                action: {
                    hover: actualMode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
                },
                error: {
                    main: "#d32f2f",
                },
                warning: {
                    main: "#ed6c02",
                },
                info: {
                    main: "#0288d1",
                },
                success: {
                    main: "#2e7d32",
                },
            },
        });
    }, [mode, primaryColor, secondaryColor]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleDarkMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    bgcolor: "background.default",
                }}
                {...rest}
            >
                <AppBar position="static" sx={{ bgcolor: 'background.default', backgroundImage: 'none' }} elevation={0}>
                    <Container maxWidth="lg">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: "none" } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Link
                                href="/"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <ApplicationLogo
                                    sx={{ width: 50, height: 50 }}
                                />
                            </Link>

                            <Box
                                sx={{
                                    display: { xs: "none", sm: "flex" },
                                    ml: 4,
                                }}
                            >
                                <Button
                                    color="inherit"
                                    component={Link}
                                    href={route("order.index")}
                                    sx={{ textTransform: "none" }}
                                >
                                    Order
                                </Button>
                            </Box>

                            {isAuthenticated && (
                                <Box
                                    sx={{
                                        display: { xs: "none", sm: "flex" },
                                        ml: 4,
                                    }}
                                >
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        href={route("dashboard")}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Dashboard
                                    </Button>
                                </Box>
                            )}

                            <Box
                                sx={{
                                    display: { xs: "none", sm: "flex" },
                                    ml: 4,
                                }}
                            >
                                {isAuthenticated && (
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        href={route("transaction.history")}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Transaction History
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />

                            <Box sx={{ display: "flex", alignItems: "center" }}>

                                <UserMenu
                                    user={user}
                                    isAuthenticated={isAuthenticated}
                                />
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: 240,
                        },
                    }}
                >
                    <Box
                        onClick={handleDrawerToggle}
                        sx={{ textAlign: "center" }}
                    >
                        <Typography variant="h6" sx={{ my: 2 }}>
                            Menu
                        </Typography>
                        <MenuItems
                            isAuthenticated={isAuthenticated}
                            onItemClick={handleDrawerToggle}
                        />
                    </Box>
                </Drawer>

                {header && (
                    <Box
                        sx={{
                            bgcolor: "background.paper",
                            boxShadow: 1,
                            py: 3,
                        }}
                    >
                        <Container maxWidth="lg">{header}</Container>
                    </Box>
                )}

                {isAuthenticated && !user.email_verified_at && (
                    <Box
                        sx={{
                            bgcolor: "rgba(198, 169, 107, 0.1)",
                            borderBottom: "1px solid rgba(198, 169, 107, 0.2)",
                            py: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                            px: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: "#C6A96B", fontWeight: "500" }}
                        >
                            Email Anda belum terverifikasi. Silakan cek inbox Anda.
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => {
                                import('@inertiajs/react').then(({ router }) => {
                                    router.post(route('verification.send'), {}, {
                                        onSuccess: () => alert('Email verifikasi telah dikirim ulang.')
                                    });
                                });
                            }}
                            sx={{
                                color: "#0A0A0A",
                                bgcolor: "#C6A96B",
                                textTransform: "none",
                                fontWeight: "bold",
                                px: 2,
                                borderRadius: 1.5,
                                "&:hover": {
                                    bgcolor: "#D4AF37",
                                },
                            }}
                        >
                            Kirim Ulang
                        </Button>
                    </Box>
                )}

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        px: { xs: 0.5, sm: 1 }, // Reduced horizontal padding for smaller screens
                        py: 3, // Keep vertical padding
                    }}
                >
                    <Container disableGutters={true}>
                        {" "}
                        {/* Remove default Container gutters */}
                        {children}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
