import { Box } from '@mui/material'; // Import Box

export default function ApplicationLogo({ sx, ...props }) { // Destructure sx prop
    return (
        <Box sx={sx}> {/* Apply sx prop to Box */}
            <img
                {...props}
                src="/images/logo.png"
                alt="Application Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Ensure image scales within Box
            />
        </Box>
    );
}
