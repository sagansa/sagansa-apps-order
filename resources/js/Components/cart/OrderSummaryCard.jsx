import React from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Stack,
    Box,
    Divider,
    Button,
} from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

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
    const isMidtrans = selectedPaymentMethod !== "manual_transfer" && selectedPaymentMethod !== "";
    const isViaUsShipping = shippingPaymentMethod === "via_us";

    // Calculate dynamic midtrans fee
    const midtransFee = (() => {
        if (!isMidtrans) return 0;
        const method = midtransMethods[selectedPaymentMethod];
        if (!method) return 0;

        const totalForFee = subtotal + shippingCostAmount;

        if (method.type === 'fixed') {
            return method.value;
        } else if (method.type === 'percentage') {
            return Math.round(totalForFee * method.value);
        } else if (method.type === 'mix') {
            return Math.round(totalForFee * method.percent) + method.fixed;
        }
        return 0;
    })();

    // Determine if manual transfer details (account and proof) are required for validation
    const manualTransferDetailsRequired =
        isManualTransfer &&
        (isSelfPickup ||
            (isDelivery && shippingCostConfirmed && isViaUsShipping));

    const isCheckoutDisabled =
        !selectedDelivery || // Metode pengiriman wajib dipilih
        !selectedPaymentMethod || // Metode pembayaran wajib dipilih
        (manualTransferDetailsRequired && // If manual transfer details are required:
            (!selectedTransferAccount || !transferProof)) || // Rekening tujuan & bukti transfer wajib jika kondisi di above terpenuhi
        (isDelivery && !selectedAddress) || // Address required if delivery
        (isDelivery &&
            shippingCostConfirmed &&
            isViaUsShipping &&
            shippingCostAmount <= 0);

    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "background.paper",
            }}
        >
            <CardHeader
                title={
                    <Typography variant="h6" sx={{ fontWeight: "900", letterSpacing: '0.5px' }}>
                        RINGKASAN BELANJA
                    </Typography>
                }
                sx={{ 
                    bgcolor: "rgba(198, 169, 107, 0.05)", 
                    pb: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            />
            <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>
                            Rp {Number(subtotal).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </Typography>
                    </Box>
                    {selectedDelivery &&
                        selectedDelivery !== "33" &&
                        shippingCostConfirmed && (
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography color="text.secondary">
                                    Ongkos Kirim
                                </Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Rp {Number(shippingCostAmount).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </Typography>
                            </Box>
                        )}
                    
                    {isMidtrans && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography color="text.secondary">Biaya Layanan/Admin</Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                Rp {Number(midtransFee).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </Typography>
                        </Box>
                    )}
                    
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    
                    <Box sx={{ width: "100%", pt: 1 }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "900" }}
                            >
                                Grand Total
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "900",
                                    color: "#C6A96B",
                                    letterSpacing: '-1px'
                                }}
                            >
                                Rp {Number(total + midtransFee).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </Typography>
                        </Stack>
                    </Box>

                    {isCheckoutDisabled && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.main', color: 'white', borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                Belum bisa konfirmasi karena:
                                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                    {!selectedDelivery && <li>Metode Pengiriman belum dipilih</li>}
                                    {!selectedPaymentMethod && <li>Metode Pembayaran belum dipilih</li>}
                                    {manualTransferDetailsRequired && !selectedTransferAccount && <li>Rekening tujuan belum dipilih</li>}
                                    {manualTransferDetailsRequired && !transferProof && <li>Bukti transfer belum diupload</li>}
                                    {isDelivery && !selectedAddress && <li>Alamat pengiriman belum dipilih</li>}
                                    {isDelivery && shippingCostConfirmed && isViaUsShipping && shippingCostAmount <= 0 && <li>Nominal ongkir belum valid</li>}
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
                            mt: 2,
                            py: 2,
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            borderRadius: 2,
                            background: "linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)",
                            boxShadow: "0 8px 16px rgba(198, 169, 107, 0.2)",
                            "&:hover": {
                                background: "linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)",
                            },
                        }}
                        disabled={isCheckoutDisabled || isProcessing}
                        onClick={handleCheckout}
                    >
                        {isProcessing ? "Processing..." : "Konfirmasi Pesanan"}
                    </Button>
                    
                    <Stack spacing={1}>
                        {!selectedDelivery && (
                            <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                                • Silakan pilih metode pengiriman.
                            </Typography>
                        )}
                        {!selectedPaymentMethod && (
                            <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                                • Silakan pilih metode pembayaran.
                            </Typography>
                        )}
                        {showAddressSelection && !selectedAddress && (
                            <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                                • Silakan pilih alamat pengiriman.
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default OrderSummaryCard;
