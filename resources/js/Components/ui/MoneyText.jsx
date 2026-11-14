import React from "react";
import { Typography } from "@mui/material";
import { formatIDR } from "@/Utils/currency";

/**
 * Tampilan angka uang (DESIGN.md: The Ledger Rule) — selalu "Rp 1.250.000",
 * digit tabular supaya kolom angka lurus, bobot tebal default 800.
 */
const MoneyText = ({ value, gold = false, weight = 800, variant = "body1", suffix, sx }) => (
    <Typography
        variant={variant}
        sx={{
            fontWeight: weight,
            fontVariantNumeric: "tabular-nums",
            color: gold ? "#C6A96B" : "text.primary",
            ...sx,
        }}
    >
        Rp {formatIDR(value)}
        {suffix ? ` ${suffix}` : ""}
    </Typography>
);

export default MoneyText;
