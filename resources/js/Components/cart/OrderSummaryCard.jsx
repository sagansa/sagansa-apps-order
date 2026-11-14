import React from "react";
import {
    Typography,
    Stack,
    Box,
    Divider,
    Button,
} from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SectionCard from "@/Components/ui/SectionCard";
import MoneyText from "@/Components/ui/MoneyText";

const SummaryRow = ({ label, value, gold = false, strong = false }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Typography
            variant="body2"
            color={strong ? "text.primary" : "text.secondary"}
            sx={strong ? { fontWeight: 600 } : undefined}
        >
            {label}
        </Typography>
        <MoneyText
            value={value}
            gold={gold}
            variant={strong ? "subtitle1" : "body2"}
            weight={strong ? 800 : 700}
        />
    </Box>
);

const OrderSummaryCard = ({
    subtotal,
    selectedDelivery,
    shippingCostConfirmed,
    shippingPaymentMethod,
    shippingCostAmount,
    total,
    handleCheckout,
    isProcessing,
    selectedPaymentMethod,
    selectedTransferAccount,
    transferProof,
    showAddressSelection,
    selectedAddress,
    deliveryServices,
    midtransMethods = {},
}) => {
    const isSelfPickup = selectedDelivery === "33";
    const deliveryMethod = deliveryServices.find(
        (service) => service.id.toString() === selectedDelivery
    );
    const isDelivery = deliveryMethod && deliveryMethod.id != 33;

    const isManualTransfer = selectedPaymentMethod === "manual_transfer";
    const isMidtrans =
        selectedPaymentMethod !== "manual_transfer" &&
        selectedPaymentMethod !== "";
    const isViaUsShipping = shippingPaymentMethod === "via_us";
    const normalizedShippingCostAmount = Number(shippingCostAmount) || 0;

    // Hitung biaya layanan Midtrans dari subtotal + ongkir
    const midtransFee = (() => {
        if (!isMidtrans) return 0;
        const method = midtransMethods[selectedPaymentMethod];
        if (!method) return 0;

        const totalForFee = subtotal + normalizedShippingCostAmount;

        if (method.type === "fixed") {
            return method.value;
        } else if (method.type === "percentage") {
            return Math.round(totalForFee * method.value);
        } else if (method.type === "mix") {
            return Math.round(totalForFee * method.percent) + method.fixed;
        }
        return 0;
    })();

    // Rekening & bukti transfer wajib untuk SEMUA transfer manual yang langsung
    // diselesaikan di checkout (ambil sendiri maupun pengiriman), baik ongkir
    // dibayar via_us maupun to_courier — agar tidak ada order "Dibayar" tanpa bukti.
    const manualTransferDetailsRequired =
        isManualTransfer &&
        (isSelfPickup || (isDelivery && shippingCostConfirmed));

    const isCheckoutDisabled =
        !selectedDelivery || // Metode pengiriman wajib dipilih
        !selectedPaymentMethod || // Metode pembayaran wajib dipilih
        (manualTransferDetailsRequired && // Jika transfer manual langsung:
            (!selectedTransferAccount || !transferProof)) || // rekening & bukti wajib
        (isDelivery && !selectedAddress) || // Alamat wajib jika dikirim
        (isDelivery &&
            shippingCostConfirmed &&
            isViaUsShipping &&
            normalizedShippingCostAmount <= 0);

    return (
        <SectionCard title="Ringkasan Belanja" icon={ReceiptLongIcon}>
            <Stack spacing={2.5}>
                <SummaryRow label="Subtotal" value={subtotal} />

                {selectedDelivery &&
                    selectedDelivery !== "33" &&
                    shippingCostConfirmed && (
                        <SummaryRow
                            label={`Ongkos Kirim${
                                isViaUsShipping ? "" : " (ke kurir)"
                            }`}
                            value={
                                isViaUsShipping
                                    ? normalizedShippingCostAmount
                                    : 0
                            }
                        />
                    )}

                {isMidtrans && (
                    <SummaryRow label="Biaya Layanan/Admin" value={midtransFee} />
                )}

                <Divider sx={{ borderStyle: "dashed" }} />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        Grand Total
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 900,
                            color: "#C6A96B",
                            letterSpacing: "-0.02em",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        Rp{" "}
                        {Number(total + midtransFee).toLocaleString("id-ID", {
                            maximumFractionDigits: 0,
                        })}
                    </Typography>
                </Box>

                {isCheckoutDisabled && (
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: "error.main",
                            color: "white",
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                            Belum bisa konfirmasi karena:
                            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                                {!selectedDelivery && (
                                    <li>Metode Pengiriman belum dipilih</li>
                                )}
                                {!selectedPaymentMethod && (
                                    <li>Metode Pembayaran belum dipilih</li>
                                )}
                                {manualTransferDetailsRequired &&
                                    !selectedTransferAccount && (
                                        <li>
                                            Rekening tujuan belum dipilih
                                        </li>
                                    )}
                                {manualTransferDetailsRequired &&
                                    !transferProof && (
                                        <li>Bukti transfer belum diupload</li>
                                    )}
                                {isDelivery && !selectedAddress && (
                                    <li>Alamat pengiriman belum dipilih</li>
                                )}
                                {isDelivery &&
                                    shippingCostConfirmed &&
                                    isViaUsShipping &&
                                    normalizedShippingCostAmount <= 0 && (
                                        <li>Nominal ongkir belum valid</li>
                                    )}
                            </ul>
                        </Typography>
                    </Box>
                )}

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartCheckoutIcon />}
                    fullWidth
                    sx={{
                        py: 2,
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        borderRadius: 2,
                        background:
                            "linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)",
                        boxShadow: "0 8px 16px rgba(198, 169, 107, 0.2)",
                        transition: "background 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                            background:
                                "linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)",
                            boxShadow: "0 8px 20px rgba(198, 169, 107, 0.3)",
                        },
                        "&:disabled": {
                            background: "rgba(0, 0, 0, 0.12)",
                            color: "rgba(0, 0, 0, 0.37)",
                            boxShadow: "none",
                        },
                    }}
                    disabled={isCheckoutDisabled || isProcessing}
                    onClick={handleCheckout}
                >
                    {isProcessing ? "Memproses..." : "Konfirmasi Pesanan"}
                </Button>
            </Stack>
        </SectionCard>
    );
};

export default OrderSummaryCard;
