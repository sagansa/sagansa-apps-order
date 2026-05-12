import React from "react";
import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";

const PaymentMethodSelector = ({
    selectedPaymentMethod = "",
    setSelectedPaymentMethod = () => {},
    midtransMethods = {},
    subtotal = 0,
    shippingCostAmount = 0
}) => {
    const handlePaymentChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const calculateFee = (methodKey) => {
        const method = midtransMethods[methodKey];
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
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <FormControl fullWidth>
                    <InputLabel id="payment-method-label">
                        Metode Pembayaran
                    </InputLabel>
                    <Select
                        labelId="payment-method-label"
                        id="payment-method"
                        value={selectedPaymentMethod}
                        label="Metode Pembayaran"
                        onChange={handlePaymentChange}
                    >
                        <MenuItem value="manual_transfer" sx={{ fontWeight: 'bold' }}>
                            Transfer Manual (Cek Manual - Tanpa Biaya)
                        </MenuItem>
                        
                        <MenuItem disabled sx={{ opacity: '1 !important', mt: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>VIRTUAL ACCOUNT (OTOMATIS)</Typography>
                        </MenuItem>
                        {Object.entries(midtransMethods).filter(([key]) => key.includes('_va') || key === 'other_va').map(([key, method]) => (
                            <MenuItem key={key} value={key}>
                                {method.label} (+Rp {calculateFee(key).toLocaleString('id-ID')})
                            </MenuItem>
                        ))}

                        <MenuItem disabled sx={{ opacity: '1 !important', mt: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>E-WALLET & QRIS (OTOMATIS)</Typography>
                        </MenuItem>
                        {Object.entries(midtransMethods).filter(([key]) => key === 'qris' || key === 'gopay' || key === 'shopeepay').map(([key, method]) => (
                            <MenuItem key={key} value={key}>
                                {method.label} (+Rp {calculateFee(key).toLocaleString('id-ID')})
                            </MenuItem>
                        ))}

                        <MenuItem disabled sx={{ opacity: '1 !important', mt: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>KARTU KREDIT (OTOMATIS)</Typography>
                        </MenuItem>
                        {Object.entries(midtransMethods).filter(([key]) => key === 'credit_card').map(([key, method]) => (
                            <MenuItem key={key} value={key}>
                                {method.label} (+Rp {calculateFee(key).toLocaleString('id-ID')})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </CardContent>
        </Card>
    );
};

export default PaymentMethodSelector;
