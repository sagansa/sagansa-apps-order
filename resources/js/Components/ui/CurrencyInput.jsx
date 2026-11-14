import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { formatIDR, parseIDR } from "@/Utils/currency";

/**
 * Input uang dengan pemisah ribuan hidup (DESIGN.md: Don't use type=number
 * for money). Nilai yang naik-turun ke parent selalu number (atau "" saat
 * kosong) — tampilan terformat hanya urusan komponen ini.
 */
const CurrencyInput = ({ label, value, onChange, ...textFieldProps }) => {
    const isEmpty = value === "" || value === null || value === undefined;
    const display = isEmpty ? "" : formatIDR(value);

    return (
        <TextField
            label={label}
            value={display}
            onChange={(e) => {
                const raw = e.target.value;
                onChange(raw === "" ? "" : parseIDR(raw));
            }}
            onFocus={(e) => e.target.select()}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start" sx={{ fontWeight: 600 }}>
                        Rp
                    </InputAdornment>
                ),
                sx: { borderRadius: 2 },
            }}
            inputProps={{
                inputMode: "numeric",
                autoComplete: "off",
            }}
            sx={{
                "& .MuiOutlinedInput-input": {
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 600,
                },
            }}
            {...textFieldProps}
        />
    );
};

export default CurrencyInput;
