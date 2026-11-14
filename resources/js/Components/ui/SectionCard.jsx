import React from "react";
import { Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";

/**
 * Kartu seksi standar ruang terang (DESIGN.md: Section Card) — putih,
 * border 1px divider, radius 16, elevation 0, header tint emas 5% dengan
 * border bawah. Menggantikan puluhan salinan sx inline yang bentuknya
 * berbeda-beda antar komponen checkout.
 */
const SectionCard = ({
    title,
    icon: Icon,
    action,
    subheader,
    children,
    contentSx,
    ...cardProps
}) => (
    <Card
        elevation={0}
        sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
            overflow: "hidden",
        }}
        {...cardProps}
    >
        {(title || action) && (
            <CardHeader
                title={
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        {Icon && <Icon sx={{ fontSize: 20, color: "#C6A96B" }} />}
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                            {title}
                        </Typography>
                    </Stack>
                }
                action={action}
                subheader={subheader}
                sx={{
                    bgcolor: "rgba(198, 169, 107, 0.05)",
                    px: 3,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "& .MuiCardHeader-action": { alignSelf: "center", m: 0 },
                }}
            />
        )}
        <CardContent sx={{ p: 3, ...contentSx }}>{children}</CardContent>
    </Card>
);

export default SectionCard;
