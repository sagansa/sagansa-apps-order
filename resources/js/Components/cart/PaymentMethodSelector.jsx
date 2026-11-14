import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import SectionCard from "@/Components/ui/SectionCard";

const PaymentMethodSelector = ({
    selectedPaymentMethod = "",
    setSelectedPaymentMethod = () => {},
    midtransMethods = {},
    subtotal = 0,
    shippingCostAmount = 0,
}) => {
    const calculateFee = (methodKey) => {
        const method = midtransMethods[methodKey];
        if (!method) return 0;

        const totalForFee = subtotal + shippingCostAmount;

        if (method.type === "fixed") {
            return method.value;
        } else if (method.type === "percentage") {
            return Math.round(totalForFee * method.value);
        } else if (method.type === "mix") {
            return Math.round(totalForFee * method.percent) + method.fixed;
        }
        return 0;
    };

    return (
        <SectionCard title="Metode Pembayaran" icon={PaymentIcon}>
            <FormControl fullWidth>
                <InputLabel id="payment-method-label">
                    Metode Pembayaran
                </InputLabel>
                <Select
                    labelId="payment-method-label"
                    id="payment-method"
                    value={selectedPaymentMethod}
                    label="Metode Pembayaran"
                    onChange={(event) =>
                        setSelectedPaymentMethod(event.target.value)
                    }
                    sx={{ borderRadius: 2 }}
                >
                    <MenuItem value="manual_transfer" sx={{ fontWeight: "bold" }}>
                        Transfer Manual (Cek Manual — Tanpa Biaya)
                    </MenuItem>
                    {/* Midtrans dinonaktifkan sementara. Saat diaktifkan
                        kembali, tampilkan fee per metode:
                        {method.label} (+Rp {calculateFee(key).toLocaleString("id-ID")}) */}
                </Select>
            </FormControl>
        </SectionCard>
    );
};

export default PaymentMethodSelector;
