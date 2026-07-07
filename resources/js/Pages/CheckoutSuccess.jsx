import {
    Typography,
    Box,
    Button,
    Paper,
    Stack,
    Container,
    Avatar,
    Divider,
    Chip,
} from "@mui/material";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DownloadIcon from "@mui/icons-material/Download";
import { useState, useEffect, useRef } from "react";
import { getPaymentStatusText, getPaymentStatusBgColor } from "@/Utils/statusUtils";
import dayjs from "dayjs";

const BANK_LOGOS = {
    bca: "/images/bank/bca.png",
    bni: "/images/bank/bni.png",
    bri: "/images/bank/bri.png",
    mandiri: "/images/bank/mandiri.png",
    permata: "/images/bank/permata.png",
};

function ExpiryCountdown({ expiryTime }) {
    const [remaining, setRemaining] = useState("");
    const [expired, setExpired] = useState(false);
    const timer = useRef(null);

    const formatDuration = (totalSeconds) => {
        if (totalSeconds <= 0) return "Kedaluwarsa";
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        if (days > 0) return `${days} hari ${hours} jam`;
        if (hours > 0) return `${hours} jam ${String(mins).padStart(2, "0")} menit`;
        if (mins > 0) return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        return `${secs} detik`;
    };

    useEffect(() => {
        const expiry = dayjs(expiryTime);
        const tick = () => {
            const now = dayjs();
            const diff = expiry.diff(now, "second");
            if (diff <= 0) {
                setExpired(true);
                setRemaining("Kedaluwarsa");
                clearInterval(timer.current);
                return;
            }
            setRemaining(formatDuration(diff));
        };
        tick();
        timer.current = setInterval(tick, 1000);
        return () => clearInterval(timer.current);
    }, [expiryTime]);

    if (!expiryTime) return null;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: expired ? "error.main" : "warning.main",
                color: "#fff",
            }}
        >
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {expired ? "Pembayaran kedaluwarsa" : `Sisa waktu: ${remaining}`}
            </Typography>
        </Box>
    );
}

const PAYMENT_METHOD_LABELS = {
    manual_transfer: "Transfer Manual",
    bca_va: "BCA Virtual Account",
    mandiri_va: "Mandiri Virtual Account",
    bni_va: "BNI Virtual Account",
    bri_va: "BRI Virtual Account",
    permata_va: "Permata Virtual Account",
    other_va: "Virtual Account Lainnya",
    qris: "QRIS",
    gopay: "GoPay",
    shopeepay: "ShopeePay",
    credit_card: "Kartu Kredit",
};

export default function CheckoutSuccess({
    auth,
    sales_order,
    midtrans_payment,
}) {
    const [copied, setCopied] = useState(null);
    const [expired, setExpired] = useState(false);
    const paymentMethod = sales_order?.payment_method;
    const isManualTransfer = paymentMethod === "manual_transfer";
    const isMidtrans = !isManualTransfer && paymentMethod;

    useEffect(() => {
        if (!midtrans_payment?.expiry_time) return;
        const expiry = dayjs(midtrans_payment.expiry_time);
        const tick = () => {
            if (expiry.diff(dayjs(), "second") <= 0) {
                setExpired(true);
            }
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [midtrans_payment?.expiry_time]);

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const getVaNumber = () => {
        if (!midtrans_payment) return null;
        if (midtrans_payment.va_numbers?.[0]?.va_number) {
            return midtrans_payment.va_numbers[0].va_number;
        }
        if (midtrans_payment.permata_va_number) {
            return midtrans_payment.permata_va_number;
        }
        if (midtrans_payment.bill_key) {
            return midtrans_payment.bill_key;
        }
        return null;
    };

    const getBankName = () => {
        if (!midtrans_payment) return null;
        if (midtrans_payment.va_numbers?.[0]?.bank) {
            return midtrans_payment.va_numbers[0].bank;
        }
        if (midtrans_payment.payment_type === "permata_va") return "permata";
        if (midtrans_payment.payment_type === "echannel") return "mandiri";
        return null;
    };

    const getQrAction = () => {
        if (!midtrans_payment?.actions) return null;
        const v2Action = midtrans_payment.actions.find(
            (a) => a.name === "generate-qr-code-v2"
        );
        if (v2Action?.url) return v2Action.url;
        const action = midtrans_payment.actions.find(
            (a) => a.name === "generate-qr-code"
        );
        return action?.url || null;
    };

    const getDeeplinkAction = () => {
        if (!midtrans_payment?.actions) return null;
        const action = midtrans_payment.actions.find(
            (a) => a.name === "deeplink-redirect"
        );
        return action?.url || null;
    };

    const getExpiryTime = () => {
        return midtrans_payment?.expiry_time || null;
    };

    const handleDownloadQR = () => {
        const url = getQrAction();
        if (!url) return;
        fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `qris-${sales_order?.order_number || "payment"}.png`;
                a.click();
                URL.revokeObjectURL(a.href);
            })
            .catch(() => {
                window.open(url, "_blank");
            });
    };

    const PAYMENT_LABELS = {
        manual_transfer: "Transfer Manual",
        bca_va: "BCA Virtual Account",
        mandiri_va: "Mandiri Virtual Account",
        bni_va: "BNI Virtual Account",
        bri_va: "BRI Virtual Account",
        permata_va: "Permata Virtual Account",
        other_va: "Virtual Account",
        qris: "QRIS",
        gopay: "GoPay",
        shopeepay: "ShopeePay",
        credit_card: "Kartu Kredit",
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const renderPaymentInstructions = () => {
        if (isManualTransfer) {
            return (
                <Box
                    sx={{
                        p: 3,
                        bgcolor: "rgba(198, 169, 107, 0.05)",
                        borderRadius: 3,
                        border: "1px dashed #C6A96B",
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: "#C6A96B",
                            fontWeight: "bold",
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <ReceiptLongIcon fontSize="small" /> Detail Pembayaran
                    </Typography>

                    {sales_order?.transfer_to_account ? (
                        <Stack spacing={1.5}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Bank
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {sales_order.transfer_to_account.bank?.name}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    No. Rekening
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {sales_order.transfer_to_account.number}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Atas Nama
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {sales_order.transfer_to_account.name}
                                </Typography>
                            </Box>
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="error">
                            Detail rekening transfer tidak tersedia. Silakan hubungi admin.
                        </Typography>
                    )}
                </Box>
            );
        }

        if (isMidtrans) {
            return (
                <Box
                    sx={{
                        p: 3,
                        bgcolor: "rgba(198, 169, 107, 0.05)",
                        borderRadius: 3,
                        border: "1px dashed #C6A96B",
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: "#C6A96B",
                            fontWeight: "bold",
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <ReceiptLongIcon fontSize="small" /> Instruksi Pembayaran
                    </Typography>

                    {!expired && midtrans_payment &&
                        (midtrans_payment.payment_type === "bank_transfer" ||
                            midtrans_payment.payment_type === "permata_va" ||
                            midtrans_payment.payment_type === "echannel") && (
                            <Stack spacing={2}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        p: 2,
                                        bgcolor: "background.paper",
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        flexWrap: { xs: "wrap", sm: "nowrap" },
                                    }}
                                >
                                    <Avatar
                                        src={BANK_LOGOS[getBankName()]}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: "white",
                                            p: 0.5,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <AccountBalanceIcon />
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Nomor Virtual Account
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontFamily: "monospace",
                                                letterSpacing: { xs: 1, sm: 2 },
                                                fontSize: { xs: "1rem", sm: "1.25rem" },
                                                wordBreak: "break-all",
                                            }}
                                        >
                                            {getVaNumber()}
                                        </Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<ContentCopyIcon />}
                                        onClick={() => handleCopy(getVaNumber(), "va")}
                                        sx={{
                                            borderColor: copied === "va" ? "success.main" : "#C6A96B",
                                            color: copied === "va" ? "success.main" : "#C6A96B",
                                            flexShrink: 0,
                                            width: { xs: "100%", sm: "auto" },
                                        }}
                                    >
                                        {copied === "va" ? "Tersalin" : "Salin"}
                                    </Button>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Lakukan transfer ke nomor Virtual Account di atas melalui
                                    mobile banking / ATM / internet banking{" "}
                                    {getBankName()?.toUpperCase()}.
                                </Typography>
                                <ExpiryCountdown expiryTime={getExpiryTime()} />
                            </Stack>
                        )}

                    {!expired && midtrans_payment?.payment_type === "qris" && getQrAction() && (
                        <Stack spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: "background.paper",
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    textAlign: "center",
                                }}
                            >
                                <img
                                    src={getQrAction()}
                                    alt="QRIS"
                                    style={{ width: 200, height: "auto" }}
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Scan QR code di atas menggunakan aplikasi e-wallet yang
                                mendukung QRIS (GoPay, ShopeePay, OVO, dll).
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownloadQR}
                                sx={{
                                    borderColor: "#C6A96B",
                                    color: "#C6A96B",
                                    borderRadius: 2,
                                    fontWeight: "bold",
                                }}
                            >
                                Download QR
                            </Button>
                            <ExpiryCountdown expiryTime={getExpiryTime()} />
                        </Stack>
                    )}

                    {expired && (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                            <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                                Pembayaran Kedaluwarsa
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Waktu pembayaran telah habis.
                            </Typography>
                            <Stack spacing={2} alignItems="center">
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        router.post(route("order.regenerate-payment", sales_order?.id), {}, {
                                            onError: () => alert("Gagal membuat ulang pembayaran."),
                                        });
                                    }}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        fontWeight: "bold",
                                        background: "linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)",
                                    }}
                                >
                                    Bayar Ulang
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => router.visit(route("order.show", sales_order?.id))}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Lihat Detail Pesanan
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {(!midtrans_payment || midtrans_payment.status_code !== "201") && (
                        <Typography variant="body2" color="error">
                            Gagal membuat pembayaran. Silakan hubungi admin.
                        </Typography>
                    )}
                </Box>
            );
        }

        return null;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pesanan Berhasil" />

            <Box
                sx={{
                    py: 6,
                    bgcolor: "background.default",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                height: 8,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                background: "linear-gradient(90deg, #C6A96B, #D4AF37)",
                            }}
                        />

                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: "rgba(76, 175, 80, 0.1)",
                                color: "success.main",
                                margin: "0 auto 24px",
                                border: "2px solid",
                                borderColor: "success.main",
                            }}
                        >
                            <CheckCircleIcon sx={{ fontSize: 48 }} />
                        </Avatar>

                        <Typography
                            variant="overline"
                            sx={{
                                color: "#C6A96B",
                                fontWeight: "bold",
                                letterSpacing: "2px",
                            }}
                        >
                            Terima Kasih
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{ fontWeight: "900", mb: 2, letterSpacing: "-1px" }}
                        >
                            Pesanan Diterima
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}
                        >
                            Pesanan Anda{" "}
                            {sales_order?.order_number ? (
                                <strong>#{sales_order.order_number}</strong>
                            ) : (
                                ""
                            )}{" "}
                            telah berhasil dibuat.
                            {isMidtrans
                                ? " Silakan selesaikan pembayaran melalui instruksi di bawah."
                                : " Silakan lakukan pembayaran melalui transfer bank untuk memproses pesanan Anda."}
                        </Typography>

                        {sales_order && isMidtrans && (
                            <Stack spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Chip
                                    label={getPaymentStatusText(sales_order.payment_status)}
                                    sx={{
                                        fontWeight: "bold",
                                        bgcolor: getPaymentStatusBgColor(sales_order.payment_status),
                                        color: "#fff",
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Pembayaran via{" "}
                                    <strong>{PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod}</strong>
                                </Typography>
                            </Stack>
                        )}

                        {isManualTransfer && sales_order?.transfer_to_account && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Pembayaran via{" "}
                                <strong>{sales_order.transfer_to_account.bank?.name}</strong>
                            </Typography>
                        )}

                        {renderPaymentInstructions()}

                        {sales_order && (
                            <Box sx={{ textAlign: "left", mb: 4 }}>
                                <Divider sx={{ mb: 3 }} />
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Subtotal
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                        {formatCurrency(sales_order.total_price - (sales_order.shipping_cost || 0) - (sales_order.admin_fee || 0))}
                                    </Typography>
                                </Box>
                                {sales_order.shipping_cost > 0 && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            Ongkos Kirim
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            {formatCurrency(sales_order.shipping_cost)}
                                        </Typography>
                                    </Box>
                                )}
                                {sales_order.admin_fee > 0 && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            Biaya Admin
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            {formatCurrency(sales_order.admin_fee)}
                                        </Typography>
                                    </Box>
                                )}
                                <Divider sx={{ my: 2 }} />
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        Total Bayar
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: "900",
                                            color: "#C6A96B",
                                        }}
                                    >
                                        {formatCurrency(sales_order.total_price)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() =>
                                    sales_order?.id &&
                                    router.visit(`/transaction-detail/${sales_order.id}`)
                                }
                                sx={{
                                    py: 2,
                                    borderRadius: 2,
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    background:
                                        "linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)",
                                    boxShadow:
                                        "0 8px 16px rgba(198, 169, 107, 0.2)",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)",
                                    },
                                }}
                            >
                                Lihat Detail Pesanan
                            </Button>

                            {isManualTransfer && (
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<WhatsAppIcon />}
                                    onClick={() => {
                                        const adminNumber = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER;
                                        if (!adminNumber) return;
                                        const message = `Halo Admin Sagansa, saya ingin konfirmasi pesanan #${sales_order?.order_number}.\n\nSilakan cek detail pesanan saya di sistem.`;
                                        window.open(
                                            `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`,
                                            "_blank"
                                        );
                                    }}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: "bold",
                                        borderColor: "#25D366",
                                        color: "#25D366",
                                        "&:hover": {
                                            borderColor: "#128C7E",
                                            bgcolor: "rgba(37, 211, 102, 0.05)",
                                        },
                                    }}
                                >
                                    Konfirmasi via WhatsApp
                                </Button>
                            )}

                            <Button
                                variant="text"
                                onClick={() => router.visit(route("order.index"))}
                                sx={{ color: "text.secondary", fontWeight: "bold" }}
                            >
                                Kembali Belanja
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
