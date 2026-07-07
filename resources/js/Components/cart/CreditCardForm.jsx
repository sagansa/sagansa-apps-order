import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, TextField, Stack, Alert } from "@mui/material";

const CreditCardForm = forwardRef(function CreditCardForm({ disabled }, ref) {
    const [cardNumber, setCardNumber] = useState("");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const popupRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getToken: async () => {
            const cleanNumber = cardNumber.replace(/\s/g, "");
            if (cleanNumber.length < 12) {
                setError("Nomor kartu tidak valid.");
                return null;
            }
            setLoading(true);
            setError(null);

            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
                const res = await fetch("/cart/card-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                    body: JSON.stringify({
                        card_number: cleanNumber,
                        card_exp_month: expMonth.padStart(2, "0") || "12",
                        card_exp_year: expYear || "2029",
                        card_cvv: cvv || "123",
                    }),
                });

                const data = await res.json();

                if (data.status_code === "200" && data.token_id) {
                    if (data.redirect_url) {
                        const token = await new Promise((resolve) => {
                            const width = 500, height = 600;
                            const left = (screen.width - width) / 2;
                            const top = (screen.height - height) / 2;
                            const popup = window.open(
                                data.redirect_url,
                                "midtrans-3ds",
                                `width=${width},height=${height},left=${left},top=${top}`
                            );
                            if (!popup) {
                                setError("Popup terblokir. Izinkan popup untuk verifikasi 3DS.");
                                setLoading(false);
                                resolve(null);
                                return;
                            }
                            popupRef.current = popup;
                            const timer = setInterval(() => {
                                if (popup.closed) {
                                    clearInterval(timer);
                                    setLoading(false);
                                    resolve(data.token_id);
                                }
                            }, 500);
                            setTimeout(() => {
                                clearInterval(timer);
                                popup.close();
                                setLoading(false);
                                resolve(data.token_id);
                            }, 180000);
                        });
                        return token;
                    }
                    setLoading(false);
                    return data.token_id;
                }

                setLoading(false);
                setError(data.validation_messages?.[0] || data.status_message || "Gagal mendapatkan token kartu.");
                return null;
            } catch (e) {
                setLoading(false);
                setError("Gagal terhubung ke server pembayaran.");
                return null;
            }
        },
        reset: () => {
            setCardNumber("");
            setExpMonth("");
            setExpYear("");
            setCvv("");
            setError(null);
            if (popupRef.current) {
                popupRef.current.close();
                popupRef.current = null;
            }
        },
    }));

    return (
        <Box sx={{ mt: 2, p: 2, bgcolor: "rgba(198, 169, 107, 0.05)", borderRadius: 2, border: "1px dashed #C6A96B" }}>
            <Typography variant="subtitle2" sx={{ color: "#C6A96B", fontWeight: "bold", mb: 2 }}>
                Detail Kartu Kredit
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Nomor Kartu"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))}
                    placeholder="4111 1111 1111 1111"
                    disabled={disabled || loading}
                    size="small"
                    fullWidth
                />
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Bulan"
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                        placeholder="12"
                        disabled={disabled || loading}
                        size="small"
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Tahun"
                        value={expYear}
                        onChange={(e) => setExpYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="2026"
                        disabled={disabled || loading}
                        size="small"
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        disabled={disabled || loading}
                        size="small"
                        sx={{ flex: 1 }}
                    />
                </Stack>
                {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}
                {loading && (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Memproses kartu...
                    </Alert>
                )}
            </Stack>
        </Box>
    );
});

export default CreditCardForm;
