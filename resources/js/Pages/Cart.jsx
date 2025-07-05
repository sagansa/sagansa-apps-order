import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    IconButton,
    Box,
    Grid,
    Divider,
    TextField,
    Avatar,
    Stack,
    Tooltip,
    Chip,
    InputAdornment,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    Alert,
    InputLabel,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import useMediaQuery from "@mui/material/useMediaQuery"; // Import useMediaQuery
import { createTheme } from "@mui/material/styles"; // Import createTheme
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import InfoIcon from "@mui/icons-material/Info";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import DeliveryAddressManagerModal from "@/Components/DeliveryAddressManagerModal";
import dayjs from "dayjs";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
    },
});

const getPriceByQuantity = (priceTiers, quantity) => {
    if (!priceTiers || priceTiers.length === 0) return 0;

    const tier = priceTiers.find(
        (tier) =>
            quantity >= tier.min_quantity &&
            (tier.max_quantity === null || quantity <= tier.max_quantity)
    );

    return tier ? tier.price : priceTiers[0].price;
};

const getDiscountPercentage = (priceTiers, quantity) => {
    if (!priceTiers || priceTiers.length === 0) return 0;

    const basePrice = priceTiers[0].price;
    const currentPrice = getPriceByQuantity(priceTiers, quantity);
    return Math.round(((basePrice - currentPrice) / basePrice) * 100);
};

export default function Cart({
    auth,
    cartItems,
    deliveryServices,
    deliveryAddresses,
    transferToAccounts,
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width: 768px)"); // Mobile layout starts at 768px

    const [quantities, setQuantities] = useState(
        cartItems?.reduce(
            (acc, item) => ({ ...acc, [item.id]: item.quantity }),
            {}
        )
    );
    const [selectedDelivery, setSelectedDelivery] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedSubdistrict, setSelectedSubdistrict] = useState("");
    const [postalCodeId, setPostalCodeId] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [openAddressManagerModal, setOpenAddressManagerModal] =
        useState(false);
    const [selectedTransferAccount, setSelectedTransferAccount] = useState("");
    const [transferProof, setTransferProof] = useState(null); // This will hold the resized file
    const [deliveryDate, setDeliveryDate] = useState(
        dayjs().format("YYYY-MM-DD")
    );
    const [previewUrl, setPreviewUrl] = useState(null); // State for image preview URL

    // State untuk konfirmasi dan nominal ongkir
    const [shippingCostConfirmed, setShippingCostConfirmed] = useState(false);
    const [shippingCostAmount, setShippingCostAmount] = useState(0);
    const [
        openShippingCostConfirmationModal,
        setOpenShippingCostConfirmationModal,
    ] = useState(false);

    // State untuk opsi pembayaran ongkos kirim
    const [shippingPaymentMethod, setShippingPaymentMethod] =
        useState("via_us"); // Default: dibayarkan melalui kami
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // State untuk metode pembayaran utama

    const handleOpenAddressManagerModal = () =>
        setOpenAddressManagerModal(true);
    const handleCloseAddressManagerModal = () =>
        setOpenAddressManagerModal(false);

    useEffect(() => {
        // Fetch provinces on component mount
        fetch(route("locations.provinces"))
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    // Effect to handle shipping cost confirmation when delivery service changes
    useEffect(() => {
        const isSelfPickup = selectedDelivery === "33";
        if (!isSelfPickup && selectedDelivery !== "") {
            // If delivery is selected and NOT self-pickup, ask for confirmation
            setOpenShippingCostConfirmationModal(true);
        } else {
            // If self-pickup or no delivery selected, reset confirmation and amount
            setShippingCostConfirmed(false);
            setShippingCostAmount(0);
            setOpenShippingCostConfirmationModal(false); // Close modal if open
        }
    }, [selectedDelivery]);

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setSelectedCity("");
        setSelectedDistrict("");
        setSelectedSubdistrict("");
        setCities([]);
        setDistricts([]);
        setSubdistricts([]);

        if (provinceId) {
            fetch(route("locations.cities", { province_id: provinceId }))
                .then((response) => response.json())
                .then((data) => setCities(data));
        }
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setSelectedDistrict("");
        setSelectedSubdistrict("");
        setDistricts([]);
        setSubdistricts([]);

        if (cityId) {
            fetch(route("locations.districts", { city_id: cityId }))
                .then((response) => response.json())
                .then((data) => setDistricts(data));
        }
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setSelectedSubdistrict("");
        setSubdistricts([]);

        if (districtId) {
            fetch(route("locations.subdistricts", { district_id: districtId }))
                .then((response) => response.json())
                .then((data) => setSubdistricts(data));
        }
    };

    const handleSubdistrictChange = (e) => {
        const subdistrictId = e.target.value;
        setSelectedSubdistrict(subdistrictId);

        if (subdistrictId) {
            fetch(
                route("locations.postal-code", {
                    subdistrict_id: subdistrictId,
                })
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.postal_code) {
                        setPostalCodeId(data.postal_code);
                    }
                });
        }
    };

    // Image resizing and handling
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("File harus berupa gambar");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const MAX_SIZE = 800; // Max width or height for the resized image
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        // Create a new File object from the Blob
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        setTransferProof(resizedFile); // Set the resized file for preview
                    },
                    file.type,
                    0.7
                ); // 0.7 is the quality (70%)

                // Set preview URL for the resized image
                setPreviewUrl(canvas.toDataURL(file.type));
            };
        };
        reader.readAsDataURL(file);
    };

    const handleQuantityChange = (itemId, change) => {
        const newQuantity = Math.max(1, (quantities[itemId] || 1) + change);
        setQuantities((prev) => ({
            ...prev,
            [itemId]: newQuantity,
        }));

        // Update di database
        router.put(
            route("cart.update", itemId),
            {
                quantity: newQuantity,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const handleQuantityInput = (itemId, value) => {
        const newValue = parseInt(value) || 1;
        const validValue = Math.max(1, newValue);

        setQuantities((prev) => ({
            ...prev,
            [itemId]: validValue,
        }));

        // Update di database
        router.put(
            route("cart.update", itemId),
            {
                quantity: validValue,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const handleDeleteItem = (itemId) => {
        if (
            window.confirm(
                "Apakah Anda yakin ingin menghapus item ini dari keranjang?"
            )
        ) {
            router.delete(route("cart.destroy", itemId), {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const calculateSubtotal = () => {
        return (
            cartItems?.reduce((total, item) => {
                const quantity = quantities[item.id] || item.quantity;
                const pricePerUnit = getPriceByQuantity(
                    item.product?.price_tiers,
                    quantity
                );
                return total + pricePerUnit * quantity;
            }, 0) || 0
        );
    };

    const subtotal = calculateSubtotal();

    // Calculate total including shipping cost if applicable
    const total =
        selectedDelivery &&
        selectedDelivery !== "33" &&
        shippingCostConfirmed &&
        shippingPaymentMethod === "via_us"
            ? subtotal + shippingCostAmount
            : subtotal;

    const handleDeliveryChange = (e) => {
        const serviceId = e.target.value;
        setSelectedDelivery(serviceId);
        // Reset selected address when delivery service changes
        setSelectedAddress("");
        // Effect di atas akan menangani modal/reset konfirmasi ongkir
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setOpenAddressDialog(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setSelectedProvince(address.province_id);
        setSelectedCity(address.city_id);
        setSelectedDistrict(address.district_id);
        setSelectedSubdistrict(address.subdistrict_id);
        setPostalCodeId(address.postal_code);

        // Fetch cities
        fetch(
            route("api.locations.cities", { province_id: address.province_id })
        )
            .then((response) => response.json())
            .then((data) => setCities(data));

        // Fetch districts
        fetch(route("api.locations.districts", { city_id: address.city_id }))
            .then((response) => response.json())
            .then((data) => setDistricts(data));

        // Fetch subdistricts
        fetch(
            route("api.locations.subdistricts", {
                district_id: address.district_id,
            })
        )
            .then((response) => response.json())
            .then((data) => setSubdistricts(data));

        setOpenAddressDialog(true);
    };

    const handleCloseAddressDialog = () => {
        setOpenAddressDialog(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = () => {
        const addressData = {
            name: document.getElementById("address-name").value,
            recipient_name: document.getElementById("recipient-name").value,
            recipient_telp_no: document.getElementById("recipient-telp").value,
            province_id: selectedProvince,
            city_id: selectedCity,
            district_id: selectedDistrict,
            subdistrict_id: selectedSubdistrict,
            postal_code_id: postalCodeId,
            address: document.getElementById("address-detail").value,
        };

        if (editingAddress) {
            router.put(
                route("delivery-address.update", editingAddress.id),
                addressData,
                {
                    onSuccess: () => {
                        handleCloseAddressDialog();
                    },
                }
            );
        } else {
            router.post(route("delivery-address.store"), addressData, {
                onSuccess: () => {
                    handleCloseAddressDialog();
                },
            });
        }
    };

    const showAddressSelection =
        selectedDelivery &&
        deliveryServices.find((s) => s.id === parseInt(selectedDelivery))
            ?.id !== "33";

    // Handler untuk konfirmasi ongkir
    const handleConfirmShippingCost = () => {
        setShippingCostConfirmed(true);
        setOpenShippingCostConfirmationModal(false);
    };

    const handleCancelShippingCost = () => {
        setShippingCostConfirmed(false);
        setShippingCostAmount(0); // Reset amount if not confirmed
        setOpenShippingCostConfirmationModal(false);
        // setSelectedDelivery(''); // Reset delivery selection as well if cancelled
    };

    const handleCheckout = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        try {
            // Validasi tambahan sebelum membuat FormData
            const isSelfPickup = selectedDelivery === "33";
            const deliveryMethod = deliveryServices.find(
                (service) => service.id.toString() === selectedDelivery
            );
            const isDelivery = deliveryMethod && deliveryMethod.id !== "33";

            // Validasi untuk Transfer Manual
            if (selectedPaymentMethod === "manual_transfer") {
                // Manual transfer details (account and proof) are only required if:
                // 1. It's self-pickup (always requires immediate payment details)
                // 2. It's delivery AND shipping cost is confirmed AND shipping payment is via us
                if (
                    isSelfPickup ||
                    (isDelivery &&
                        shippingCostConfirmed &&
                        shippingPaymentMethod === "via_us")
                ) {
                    if (!selectedTransferAccount) {
                        alert("Mohon pilih rekening tujuan transfer.");
                        return;
                    }
                    if (!transferProof) {
                        alert("Mohon upload bukti transfer.");
                        return;
                    }
                }
                // If it's delivery AND shipping cost is NOT confirmed, then payment details are not required at this stage.
                // The order will be created as pending, and user will confirm payment later.
            } else if (selectedPaymentMethod === "midtrans") {
                // No specific frontend validation for Midtrans here, as it will be handled by Midtrans gateway
            }

            // Kondisi 2 (Bayar Via Kami): Perlu nominal ongkir > 0 jika Pengiriman + Ongkir Sudah Konfirmasi + Bayar Via Kami
            if (
                isDelivery &&
                shippingCostConfirmed &&
                shippingPaymentMethod === "via_us" &&
                shippingCostAmount <= 0
            ) {
                alert(
                    "Mohon masukkan nominal biaya pengiriman yang valid (lebih dari 0) jika dibayarkan melalui kami."
                );
                return;
            }

            // Kondisi: Perlu Alamat Pengiriman jika Pengiriman
            if (isDelivery && !selectedAddress) {
                // Wajib alamat jika pengiriman (terlepas konfirmasi ongkir/metode bayar ongkir)
                alert("Mohon pilih alamat pengiriman.");
                return;
            }

            const formData = new FormData();
            formData.append("delivery_service_id", selectedDelivery);

            // Sertakan delivery_address_id hanya jika metode pengiriman BUKAN ambil sendiri
            if (isDelivery) {
                formData.append("delivery_address_id", selectedAddress);
            }

            // Append transfer_to_account_id if manual transfer is selected
            if (selectedPaymentMethod === "manual_transfer") {
                formData.append(
                    "transfer_to_account_id",
                    selectedTransferAccount || ""
                );
            } else {
                formData.append("transfer_to_account_id", ""); // Ensure it's always sent, even if empty
            }

            // Always append image_payment if transferProof exists
            if (transferProof) {
                formData.append("image_payment", transferProof);
            }

            formData.append("delivery_date", deliveryDate);

            // Tambahkan nominal ongkir:
            // - Jika Pengiriman + Ongkir Konfirmasi + Bayar Via Kami: Kirim shippingCostAmount
            // - Jika Pengiriman + Belum Konfirmasi Ongkir ATAU Pengiriman + Ongkir Konfirmasi + Bayar Langsung Kurir: Kirim 0
            // - Jika Ambil Sendiri: Kirim 0
            const finalShippingCostForBackend =
                isDelivery &&
                shippingCostConfirmed &&
                shippingPaymentMethod === "via_us"
                    ? shippingCostAmount
                    : 0; // Untuk status 4 atau bayar ke kurir, kirim 0 ke backend

            formData.append("shipping_cost", finalShippingCostForBackend);

            // Logika penentuan status pembayaran
            let paymentStatus;
            if (selectedPaymentMethod === "manual_transfer") {
                if (isSelfPickup) {
                    // Jika Ambil Sendiri, payment_status 1 jika bukti transfer diupload, 4 jika belum
                    paymentStatus = transferProof ? 1 : 4;
                } else if (isDelivery && shippingCostConfirmed) {
                    // Jika Pengiriman dan Ongkir Sudah Konfirmasi (baik via kami atau ke kurir), set payment_status = 1.
                    // Bukti transfer untuk 'via_us' akan divalidasi di backend jika payment_status 1.
                    paymentStatus = 1;
                } else if (isDelivery && !shippingCostConfirmed) {
                    // Jika Pengiriman tapi BELUM konfirmasi Ongkir. Status selalu 4.
                    paymentStatus = 4;
                } else {
                    // Fallback, seharusnya tidak tercapai jika validasi frontend OK
                    paymentStatus = 4;
                }
            } else if (selectedPaymentMethod === "midtrans") {
                // For Midtrans, initial status could be pending (e.g., 5) or direct to Midtrans gateway
                // Assuming 5 for pending Midtrans payment, backend will update after transaction.
                paymentStatus = 5;
            } else {
                // Default or fallback if no payment method is selected
                paymentStatus = 4;
            }

            formData.append("shipping_payment_method", shippingPaymentMethod); // Add this line to send the shipping payment method
            formData.append("payment_status", paymentStatus);
            formData.append("payment_method", selectedPaymentMethod); // Add this line to send the selected payment method

            // Ubah format items
            const items = cartItems.map((item) => ({
                product_id: item.product.id,
                quantity: quantities[item.id] || item.quantity,
                price: getPriceByQuantity(
                    item.product?.price_tiers,
                    quantities[item.id] || item.quantity
                ),
            }));

            // Ubah cara append items ke FormData
            items.forEach((item, index) => {
                formData.append(`items[${index}][product_id]`, item.product_id);
                formData.append(`items[${index}][quantity]`, item.quantity);
                formData.append(`items[${index}][price]`, item.price);
            });

            router.post(route("cart.checkout"), formData, {
                onSuccess: () => {
                    // Redirect akan ditangani oleh backend
                },
                onError: (errors) => {
                    console.error("Error:", errors);
                    // Tampilkan pesan error ke user
                    alert(
                        "Terjadi kesalahan saat checkout. Silakan coba lagi."
                    );
                },
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat checkout. Silakan coba lagi.");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{ color: "text.primary" }}
                >
                    Keranjang Belanja
                </Typography>
            }
        >
            <Head title="Keranjang Belanja" />

            {/* Optimize padding for smaller screens */}
            <Box sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
                {cartItems?.length === 0 ? (
                    <Stack
                        spacing={2}
                        alignItems="center"
                        sx={{
                            minHeight: "calc(100vh - 300px)",
                            justifyContent: "center",
                        }}
                    >
                        <ShoppingCartOutlinedIcon
                            sx={{ fontSize: 60, color: "text.secondary" }}
                        />
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            align="center"
                        >
                            Keranjang Belanja Kosong
                        </Typography>
                    </Stack>
                ) : isMobile ? ( // If mobile (<= 768px), stack the sections vertically
                    <Stack spacing={3}>
                        {showAddressSelection && (
                            <Card sx={{ mb: 3 }}>
                                <CardHeader
                                    title={
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <LocalShippingIcon />
                                                <Typography variant="h6">
                                                    Alamat Pengiriman
                                                </Typography>
                                            </Stack>
                                            <Button
                                                startIcon={<LocationOnIcon />}
                                                onClick={
                                                    handleOpenAddressManagerModal
                                                }
                                                size="small"
                                            >
                                                {selectedAddress
                                                    ? "Ubah Alamat"
                                                    : "Pilih Alamat"}
                                            </Button>
                                        </Stack>
                                    }
                                />
                                <CardContent>
                                    {/* Tampilkan alamat yang dipilih atau pesan placeholder */}
                                    {selectedAddress ? (
                                        (() => {
                                            const selectedAddressObject =
                                                deliveryAddresses.find(
                                                    (address) =>
                                                        address.id.toString() ===
                                                        selectedAddress
                                                );
                                            if (!selectedAddressObject)
                                                return (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        align="center"
                                                    >
                                                        Silakan pilih alamat
                                                        pengiriman.
                                                    </Typography>
                                                );
                                            return (
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography variant="subtitle1">
                                                        {
                                                            selectedAddressObject.name
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Penerima:{" "}
                                                        {
                                                            selectedAddressObject.recipient_name
                                                        }{" "}
                                                        <br />
                                                        No. Telp:{" "}
                                                        {
                                                            selectedAddressObject.recipient_telp_no
                                                        }{" "}
                                                        <br />
                                                        Alamat:{" "}
                                                        {
                                                            selectedAddressObject.address
                                                        }{" "}
                                                        <br />
                                                        {selectedAddressObject
                                                            .subdistrict?.name
                                                            ? `${selectedAddressObject.subdistrict.name}, `
                                                            : ""}
                                                        {selectedAddressObject
                                                            .district?.name
                                                            ? `${selectedAddressObject.district.name}, `
                                                            : ""}
                                                        {selectedAddressObject
                                                            .city?.name
                                                            ? `${selectedAddressObject.city.name}, `
                                                            : ""}
                                                        {selectedAddressObject
                                                            .province?.name
                                                            ? `${selectedAddressObject.province.name}`
                                                            : ""}
                                                        <br />
                                                        Kode Pos:{" "}
                                                        {selectedAddressObject.postal_code_id ||
                                                            "-"}
                                                    </Typography>
                                                </Box>
                                            );
                                        })()
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            align="center"
                                        >
                                            Silakan pilih alamat pengiriman.
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                        <Card>
                            <CardHeader
                                title={
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                    >
                                        <Typography variant="h5" component="h1">
                                            Daftar Produk (
                                            {cartItems?.length || 0} item)
                                        </Typography>
                                        <Tooltip title="Harga akan menurun sesuai dengan jumlah pembelian">
                                            <IconButton size="small">
                                                <InfoIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                }
                            />
                            <CardContent>
                                <Stack spacing={2}>
                                    {cartItems?.map((item) => (
                                        <Card key={item.id} variant="outlined">
                                            <CardContent>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                >
                                                    <Avatar
                                                        variant="rounded"
                                                        src={
                                                            item.product?.image
                                                        }
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                        }}
                                                    />
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontSize:
                                                                    "0.9rem",
                                                            }}
                                                        >
                                                            {item.product?.name}
                                                        </Typography>
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            alignItems="center"
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Rp{" "}
                                                                {getPriceByQuantity(
                                                                    item.product
                                                                        ?.price_tiers,
                                                                    quantities[
                                                                        item.id
                                                                    ] ||
                                                                        item.quantity
                                                                )?.toLocaleString()}{" "}
                                                                /{" "}
                                                                {item.product
                                                                    ?.unit
                                                                    ?.unit ||
                                                                    "unit"}
                                                            </Typography>
                                                            {getDiscountPercentage(
                                                                item.product
                                                                    ?.price_tiers,
                                                                quantities[
                                                                    item.id
                                                                ] ||
                                                                    item.quantity
                                                            ) > 0 && (
                                                                <Chip
                                                                    label={`Diskon ${getDiscountPercentage(
                                                                        item
                                                                            .product
                                                                            ?.price_tiers,
                                                                        quantities[
                                                                            item
                                                                                .id
                                                                        ] ||
                                                                            item.quantity
                                                                    )}%`}
                                                                    color="success"
                                                                    size="small"
                                                                />
                                                            )}
                                                        </Stack>
                                                        {item.product
                                                            ?.price_tiers
                                                            ?.length > 0 && (
                                                            <Tooltip
                                                                title={
                                                                    <Box>
                                                                        <Typography variant="subtitle2">
                                                                            Tier
                                                                            Harga:
                                                                        </Typography>
                                                                        {item.product.price_tiers.map(
                                                                            (
                                                                                tier,
                                                                                index
                                                                            ) => (
                                                                                <Typography
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    variant="body2"
                                                                                >
                                                                                    {tier.label ||
                                                                                        `${
                                                                                            tier.min_quantity
                                                                                        }-${
                                                                                            tier.max_quantity ||
                                                                                            "∞"
                                                                                        } ${
                                                                                            item
                                                                                                .product
                                                                                                ?.unit
                                                                                                ?.unit ||
                                                                                            "unit"
                                                                                        }`}

                                                                                    :
                                                                                    Rp{" "}
                                                                                    {tier.price.toLocaleString()}{" "}
                                                                                    /{" "}
                                                                                    {item
                                                                                        .product
                                                                                        ?.unit
                                                                                        ?.unit ||
                                                                                        "unit"}
                                                                                </Typography>
                                                                            )
                                                                        )}
                                                                    </Box>
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        cursor: "help",
                                                                    }}
                                                                >
                                                                    Lihat tier
                                                                    harga
                                                                </Typography>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </Stack>
                                                <Divider sx={{ my: 1.5 }} />
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    -1
                                                                )
                                                            }
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <TextField
                                                            value={
                                                                quantities[
                                                                    item.id
                                                                ] ||
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleQuantityInput(
                                                                    item.id,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            type="number"
                                                            size="small"
                                                            sx={{
                                                                width: "60px",
                                                            }}
                                                            inputProps={{
                                                                min: 1,
                                                                style: {
                                                                    textAlign:
                                                                        "center",
                                                                },
                                                            }}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="text.secondary"
                                                                        >
                                                                            {item
                                                                                .product
                                                                                ?.unit
                                                                                ?.unit ||
                                                                                "unit"}
                                                                        </Typography>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Stack>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Rp{" "}
                                                        {(
                                                            (quantities[
                                                                item.id
                                                            ] ||
                                                                item.quantity) *
                                                            getPriceByQuantity(
                                                                item.product
                                                                    ?.price_tiers,
                                                                quantities[
                                                                    item.id
                                                                ] ||
                                                                    item.quantity
                                                            )
                                                        )?.toLocaleString()}
                                                    </Typography>
                                                    <IconButton
                                                        color="error"
                                                        aria-label="hapus"
                                                        size="small"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>

                        <Stack spacing={3} sx={{ position: "sticky", top: 24 }}>
                            <Card>
                                <CardContent>
                                    <FormControl fullWidth>
                                        <InputLabel id="delivery-service-label">
                                            Metode Pengiriman
                                        </InputLabel>
                                        <Select
                                            labelId="delivery-service-label"
                                            id="delivery-service"
                                            value={selectedDelivery}
                                            label="Metode Pengiriman"
                                            onChange={handleDeliveryChange}
                                        >
                                            {deliveryServices.map((service) => (
                                                <MenuItem
                                                    key={service.id}
                                                    value={service.id.toString()}
                                                >
                                                    {service.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>

                            {/* Tampilkan input nominal ongkir jika sudah dikonfirmasi (tidak self-pickup) */}
                            {selectedDelivery &&
                                selectedDelivery !== "33" &&
                                shippingCostConfirmed && (
                                    <Card sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                            >
                                                Pembayaran Ongkos Kirim
                                            </Typography>
                                            <FormControl
                                                component="fieldset"
                                                fullWidth
                                            >
                                                <FormLabel component="legend">
                                                    Metode Pembayaran Ongkos
                                                    Kirim
                                                </FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-label="shipping-payment-method"
                                                    name="shipping-payment-method"
                                                    value={
                                                        shippingPaymentMethod
                                                    }
                                                    onChange={(e) =>
                                                        setShippingPaymentMethod(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <FormControlLabel
                                                        value="via_us"
                                                        control={<Radio />}
                                                        label="Dibayarkan melalui kami"
                                                    />
                                                    <FormControlLabel
                                                        value="to_courier"
                                                        control={<Radio />}
                                                        label="Dibayarkan langsung pembeli ke kurir"
                                                    />
                                                </RadioGroup>

                                                {/* Container for dynamic shipping cost input/alert */}
                                                <Box
                                                    sx={{
                                                        minHeight: "80px",
                                                        mt: 2,
                                                    }}
                                                >
                                                    {" "}
                                                    {/* Reserve space */}
                                                    {shippingPaymentMethod ===
                                                    "via_us" ? (
                                                        <TextField
                                                            label="Nominal Biaya Pengiriman"
                                                            type="number"
                                                            fullWidth
                                                            value={
                                                                shippingCostAmount
                                                            }
                                                            onChange={(e) =>
                                                                setShippingCostAmount(
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                )
                                                            }
                                                            InputProps={{
                                                                startAdornment:
                                                                    (
                                                                        <InputAdornment position="start">
                                                                            Rp
                                                                        </InputAdornment>
                                                                    ),
                                                            }}
                                                            inputProps={{
                                                                min: 0,
                                                            }}
                                                        />
                                                    ) : shippingPaymentMethod ===
                                                      "to_courier" ? (
                                                        <Alert severity="info">
                                                            Nominal ongkos kirim
                                                            dibayarkan langsung
                                                            ke kurir saat
                                                            pesanan diterima.
                                                        </Alert>
                                                    ) : null}
                                                </Box>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Card Metode Pembayaran */}
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
                                            onChange={(e) =>
                                                setSelectedPaymentMethod(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <MenuItem value="manual_transfer">
                                                Transfer Manual
                                            </MenuItem>
                                            <MenuItem value="midtrans">
                                                Midtrans
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>

                            {/* Card Pilih Rekening Tujuan Transfer (Hanya jika Transfer Manual dipilih DAN (Ambil Sendiri ATAU Pengiriman + Ongkir Konfirmasi)) */}
                            {selectedPaymentMethod === "manual_transfer" && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <FormControl fullWidth>
                                            <InputLabel id="transfer-account-label">
                                                Rekening Tujuan
                                            </InputLabel>
                                            <Select
                                                labelId="transfer-account-label"
                                                id="transfer-account"
                                                value={selectedTransferAccount}
                                                label="Rekening Tujuan"
                                                onChange={(e) =>
                                                    setSelectedTransferAccount(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {transferToAccounts &&
                                                    transferToAccounts.map(
                                                        (acc) => (
                                                            <MenuItem
                                                                key={acc.id}
                                                                value={acc.id}
                                                            >
                                                                {acc.bank?.name}{" "}
                                                                - {acc.number} -{" "}
                                                                {acc.name}
                                                            </MenuItem>
                                                        )
                                                    )}
                                            </Select>
                                        </FormControl>

                                        {/* Tampilkan upload bukti transfer jika rekening sudah dipilih dan Card ini tampil */}
                                        {selectedTransferAccount && (
                                            <Box mt={3}>
                                                <Typography
                                                    variant="subtitle2"
                                                    gutterBottom
                                                >
                                                    Bukti Transfer
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    fullWidth
                                                >
                                                    Upload Gambar
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        hidden
                                                        onChange={(e) =>
                                                            handleFileChange(e)
                                                        }
                                                    />
                                                </Button>
                                                {transferProof && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ mt: 1 }}
                                                    >
                                                        File:{" "}
                                                        {transferProof.name}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardContent>
                                    <TextField
                                        label="Tanggal Pengiriman"
                                        type="date"
                                        fullWidth
                                        value={deliveryDate}
                                        onChange={(e) =>
                                            setDeliveryDate(e.target.value)
                                        }
                                        InputProps={{
                                            inputProps: {
                                                min: dayjs().format(
                                                    "YYYY-MM-DD"
                                                ),
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader
                                    title={
                                        <Typography variant="h6">
                                            Ringkasan Belanja
                                        </Typography>
                                    }
                                />
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Typography>Subtotal</Typography>
                                            <Typography>
                                                Rp {subtotal.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        {selectedDelivery &&
                                            selectedDelivery !== "33" &&
                                            shippingCostConfirmed && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <Typography>
                                                        Ongkos Kirim
                                                    </Typography>
                                                    <Typography>
                                                        Rp{" "}
                                                        {shippingCostAmount.toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            )}
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {selectedDelivery &&
                                            selectedDelivery !== "33" &&
                                            !shippingCostConfirmed
                                                ? "*) Silakan konfirmasi biaya pengiriman dengan admin"
                                                : ""}
                                        </Typography>
                                        <Divider />
                                        <Box sx={{ width: "100%" }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "flex-start",
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: "bold" }}
                                                >
                                                    Grand Total
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={
                                                <ShoppingCartCheckoutIcon />
                                            }
                                            fullWidth
                                            sx={{ mt: 2 }}
                                            disabled={
                                                !selectedDelivery || // Metode pengiriman wajib dipilih
                                                !selectedPaymentMethod || // Metode pembayaran wajib dipilih
                                                (selectedPaymentMethod ===
                                                    "manual_transfer" && // Jika transfer manual:
                                                    (selectedDelivery ===
                                                        "33" ||
                                                        (selectedDelivery !==
                                                            "33" &&
                                                            shippingCostConfirmed &&
                                                            shippingPaymentMethod ===
                                                                "via_us")) && // Hanya wajib jika self-pickup ATAU pengiriman, ongkir dikonfirmasi, dan bayar via kami
                                                    (!selectedTransferAccount ||
                                                        !transferProof)) || // Rekening tujuan & bukti transfer wajib jika kondisi di atas terpenuhi
                                                (selectedDelivery !== "33" && // Jika pengiriman (bukan ambil sendiri):
                                                    shippingCostAmount <= 0) // Jika bayar via kami, nominal ongkir > 0 wajib
                                            }
                                            onClick={handleCheckout}
                                        >
                                            Checkout
                                        </Button>
                                        {!selectedDelivery && (
                                            <Typography
                                                variant="caption"
                                                color="error"
                                            >
                                                Silakan pilih metode pengiriman.
                                            </Typography>
                                        )}
                                        {!selectedPaymentMethod && (
                                            <Typography
                                                variant="caption"
                                                color="error"
                                            >
                                                Silakan pilih metode pembayaran.
                                            </Typography>
                                        )}
                                        {showAddressSelection &&
                                            !selectedAddress && (
                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                >
                                                    Silakan pilih alamat
                                                    pengiriman.
                                                </Typography>
                                            )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Stack>
                ) : (
                    <Grid container spacing={3} flexWrap="nowrap">
                        <Grid item sm={8} md={8}>
                            {showAddressSelection && (
                                <Card sx={{ mb: 3 }}>
                                    <CardHeader
                                        title={
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <LocalShippingIcon />
                                                    <Typography variant="h6">
                                                        Alamat Pengiriman
                                                    </Typography>
                                                </Stack>
                                                <Button
                                                    startIcon={
                                                        <LocationOnIcon />
                                                    }
                                                    onClick={
                                                        handleOpenAddressManagerModal
                                                    }
                                                    size="small"
                                                >
                                                    {selectedAddress
                                                        ? "Ubah Alamat"
                                                        : "Pilih Alamat"}
                                                </Button>
                                            </Stack>
                                        }
                                    />
                                    <CardContent>
                                        {/* Tampilkan alamat yang dipilih atau pesan placeholder */}
                                        {selectedAddress ? (
                                            (() => {
                                                const selectedAddressObject =
                                                    deliveryAddresses.find(
                                                        (address) =>
                                                            address.id.toString() ===
                                                            selectedAddress
                                                    );
                                                if (!selectedAddressObject)
                                                    return (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            align="center"
                                                        >
                                                            Silakan pilih alamat
                                                            pengiriman.
                                                        </Typography>
                                                    );
                                                return (
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            border: "1px solid",
                                                            borderColor:
                                                                "divider",
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1">
                                                            {
                                                                selectedAddressObject.name
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Penerima:{" "}
                                                            {
                                                                selectedAddressObject.recipient_name
                                                            }{" "}
                                                            <br />
                                                            No. Telp:{" "}
                                                            {
                                                                selectedAddressObject.recipient_telp_no
                                                            }{" "}
                                                            <br />
                                                            Alamat:{" "}
                                                            {
                                                                selectedAddressObject.address
                                                            }{" "}
                                                            <br />
                                                            {selectedAddressObject
                                                                .subdistrict
                                                                ?.name
                                                                ? `${selectedAddressObject.subdistrict.name}, `
                                                                : ""}
                                                            {selectedAddressObject
                                                                .district?.name
                                                                ? `${selectedAddressObject.district.name}, `
                                                                : ""}
                                                            {selectedAddressObject
                                                                .city?.name
                                                                ? `${selectedAddressObject.city.name}, `
                                                                : ""}
                                                            {selectedAddressObject
                                                                .province?.name
                                                                ? `${selectedAddressObject.province.name}`
                                                                : ""}
                                                            <br />
                                                            Kode Pos:{" "}
                                                            {selectedAddressObject.postal_code_id ||
                                                                "-"}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })()
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                align="center"
                                            >
                                                Silakan pilih alamat pengiriman.
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                            <Card>
                                <CardHeader
                                    title={
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >
                                            <Typography
                                                variant="h5"
                                                component="h1"
                                            >
                                                Daftar Produk (
                                                {cartItems?.length || 0} item)
                                            </Typography>
                                            <Tooltip title="Harga akan menurun sesuai dengan jumlah pembelian">
                                                <IconButton size="small">
                                                    <InfoIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    }
                                />
                                <CardContent>
                                    <TableContainer
                                        component={Paper}
                                        sx={{ overflowX: "auto" }}
                                    >
                                        <Table>
                                            <TableBody>
                                                {cartItems?.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <Stack
                                                                direction="row"
                                                                spacing={2}
                                                                alignItems="center"
                                                            >
                                                                <Avatar
                                                                    variant="rounded"
                                                                    src={
                                                                        item
                                                                            .product
                                                                            ?.image
                                                                    }
                                                                    sx={{
                                                                        width: {
                                                                            xs: 50,
                                                                            sm: 80,
                                                                        },
                                                                        height: {
                                                                            xs: 50,
                                                                            sm: 80,
                                                                        },
                                                                    }}
                                                                />
                                                                <Box>
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        sx={{
                                                                            fontSize:
                                                                                {
                                                                                    xs: "0.9rem",
                                                                                    sm: "1rem",
                                                                                },
                                                                        }}
                                                                    >
                                                                        {
                                                                            item
                                                                                .product
                                                                                ?.name
                                                                        }
                                                                    </Typography>
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={
                                                                            1
                                                                        }
                                                                        alignItems="center"
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                        >
                                                                            Rp{" "}
                                                                            {getPriceByQuantity(
                                                                                item
                                                                                    .product
                                                                                    ?.price_tiers,
                                                                                quantities[
                                                                                    item
                                                                                        .id
                                                                                ] ||
                                                                                    item.quantity
                                                                            )?.toLocaleString()}
                                                                            /
                                                                            {item
                                                                                .product
                                                                                ?.unit
                                                                                ?.unit ||
                                                                                "unit"}
                                                                        </Typography>
                                                                        {getDiscountPercentage(
                                                                            item
                                                                                .product
                                                                                ?.price_tiers,
                                                                            quantities[
                                                                                item
                                                                                    .id
                                                                            ] ||
                                                                                item.quantity
                                                                        ) >
                                                                            0 && (
                                                                            <Chip
                                                                                label={`Diskon ${getDiscountPercentage(
                                                                                    item
                                                                                        .product
                                                                                        ?.price_tiers,
                                                                                    quantities[
                                                                                        item
                                                                                            .id
                                                                                    ] ||
                                                                                        item.quantity
                                                                                )}%`}
                                                                                color="success"
                                                                                size="small"
                                                                            />
                                                                        )}
                                                                    </Stack>
                                                                    {item
                                                                        .product
                                                                        ?.price_tiers
                                                                        ?.length >
                                                                        0 && (
                                                                        <Tooltip
                                                                            title={
                                                                                <Box>
                                                                                    <Typography variant="subtitle2">
                                                                                        Tier
                                                                                        Harga:
                                                                                    </Typography>
                                                                                    {item.product.price_tiers.map(
                                                                                        (
                                                                                            tier,
                                                                                            index
                                                                                        ) => (
                                                                                            <Typography
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                variant="body2"
                                                                                            >
                                                                                                {tier.label ||
                                                                                                    `${
                                                                                                        tier.min_quantity
                                                                                                    }-${
                                                                                                        tier.max_quantity ||
                                                                                                        "∞"
                                                                                                    } ${
                                                                                                        item
                                                                                                            .product
                                                                                                            ?.unit
                                                                                                            ?.unit ||
                                                                                                        "unit"
                                                                                                    }`}

                                                                                                :
                                                                                                Rp{" "}
                                                                                                {tier.price.toLocaleString()}

                                                                                                /
                                                                                                {item
                                                                                                    .product
                                                                                                    ?.unit
                                                                                                    ?.unit ||
                                                                                                    "unit"}
                                                                                            </Typography>
                                                                                        )
                                                                                    )}
                                                                                </Box>
                                                                            }
                                                                        >
                                                                            <Typography
                                                                                variant="caption"
                                                                                color="text.secondary"
                                                                                sx={{
                                                                                    cursor: "help",
                                                                                }}
                                                                            >
                                                                                Lihat
                                                                                tier
                                                                                harga
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    )}
                                                                </Box>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Stack
                                                                direction="row"
                                                                spacing={1}
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            -1
                                                                        )
                                                                    }
                                                                >
                                                                    <RemoveIcon />
                                                                </IconButton>
                                                                <TextField
                                                                    value={
                                                                        quantities[
                                                                            item
                                                                                .id
                                                                        ] ||
                                                                        item.quantity
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuantityInput(
                                                                            item.id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    type="number"
                                                                    size="small"
                                                                    sx={{
                                                                        width: {
                                                                            xs: "60px",
                                                                            sm: "80px",
                                                                        },
                                                                    }} /* Responsive width */
                                                                    inputProps={{
                                                                        min: 1,
                                                                        style: {
                                                                            textAlign:
                                                                                "center",
                                                                        } /* Remove fixed width here */,
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment:
                                                                            (
                                                                                <InputAdornment position="end">
                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        color="text.secondary"
                                                                                    >
                                                                                        {item
                                                                                            .product
                                                                                            ?.unit
                                                                                            ?.unit ||
                                                                                            "unit"}
                                                                                    </Typography>
                                                                                </InputAdornment>
                                                                            ),
                                                                    }}
                                                                />
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            1
                                                                        )
                                                                    }
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="subtitle1">
                                                                Rp{" "}
                                                                {(
                                                                    (quantities[
                                                                        item.id
                                                                    ] ||
                                                                        item.quantity) *
                                                                    getPriceByQuantity(
                                                                        item
                                                                            .product
                                                                            ?.price_tiers,
                                                                        quantities[
                                                                            item
                                                                                .id
                                                                        ] ||
                                                                            item.quantity
                                                                    )
                                                                )?.toLocaleString()}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <IconButton
                                                                color="error"
                                                                aria-label="hapus"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleDeleteItem(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item sm={4} md={4}>
                            <Stack
                                spacing={3}
                                sx={{}} // Removed sticky positioning
                            >
                                <Card>
                                    {/* <CardHeader
                                            title={
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <LocalShippingIcon />
                                                    <Typography variant="h6">
                                                        Pilih Pengiriman
                                                    </Typography>
                                                </Stack>
                                            }
                                        /> */}
                                    <CardContent>
                                        <FormControl fullWidth>
                                            <InputLabel id="delivery-service-label">
                                                Metode Pengiriman
                                            </InputLabel>
                                            <Select
                                                labelId="delivery-service-label"
                                                id="delivery-service"
                                                value={selectedDelivery}
                                                label="Metode Pengiriman"
                                                onChange={handleDeliveryChange}
                                            >
                                                {deliveryServices.map(
                                                    (service) => (
                                                        <MenuItem
                                                            key={service.id}
                                                            value={service.id.toString()}
                                                        >
                                                            {service.name}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </Card>

                                {/* Tampilkan input nominal ongkir jika sudah dikonfirmasi (tidak self-pickup) */}
                                {selectedDelivery &&
                                    selectedDelivery !== "33" &&
                                    shippingCostConfirmed && (
                                        <Card sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography
                                                    variant="subtitle1"
                                                    gutterBottom
                                                >
                                                    Pembayaran Ongkos Kirim
                                                </Typography>
                                                <FormControl
                                                    component="fieldset"
                                                    fullWidth
                                                >
                                                    <FormLabel component="legend">
                                                        Metode Pembayaran Ongkos
                                                        Kirim
                                                    </FormLabel>
                                                    <RadioGroup
                                                        row
                                                        aria-label="shipping-payment-method"
                                                        name="shipping-payment-method"
                                                        value={
                                                            shippingPaymentMethod
                                                        }
                                                        onChange={(e) =>
                                                            setShippingPaymentMethod(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <FormControlLabel
                                                            value="via_us"
                                                            control={<Radio />}
                                                            label="Dibayarkan melalui kami"
                                                        />
                                                        <FormControlLabel
                                                            value="to_courier"
                                                            control={<Radio />}
                                                            label="Dibayarkan langsung pembeli ke kurir"
                                                        />
                                                    </RadioGroup>
                                                </FormControl>

                                                {/* Container for dynamic shipping cost input/alert */}
                                                <Box
                                                    sx={{
                                                        minHeight: "80px",
                                                        mt: 2,
                                                    }}
                                                >
                                                    {" "}
                                                    {/* Reserve space */}
                                                    {shippingPaymentMethod ===
                                                    "via_us" ? (
                                                        <TextField
                                                            label="Nominal Biaya Pengiriman"
                                                            type="number"
                                                            fullWidth
                                                            value={
                                                                shippingCostAmount
                                                            }
                                                            onChange={(e) =>
                                                                setShippingCostAmount(
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                )
                                                            }
                                                            InputProps={{
                                                                startAdornment:
                                                                    (
                                                                        <InputAdornment position="start">
                                                                            Rp
                                                                        </InputAdornment>
                                                                    ),
                                                            }}
                                                            inputProps={{
                                                                min: 0,
                                                            }}
                                                        />
                                                    ) : shippingPaymentMethod ===
                                                      "to_courier" ? (
                                                        <Alert severity="info">
                                                            Nominal ongkos kirim
                                                            dibayarkan langsung
                                                            ke kurir saat
                                                            pesanan diterima.
                                                        </Alert>
                                                    ) : null}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    )}

                                {/* Card Metode Pembayaran */}
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
                                                onChange={(e) =>
                                                    setSelectedPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <MenuItem value="manual_transfer">
                                                    Transfer Manual
                                                </MenuItem>
                                                <MenuItem value="midtrans">
                                                    Midtrans
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </Card>

                                {/* Card Pilih Rekening Tujuan Transfer (Hanya jika Transfer Manual dipilih DAN (Ambil Sendiri ATAU Pengiriman + Ongkir Konfirmasi)) */}
                                {selectedPaymentMethod ===
                                    "manual_transfer" && (
                                    <Card sx={{ mb: 3 }}>
                                        <CardContent>
                                            <FormControl fullWidth>
                                                <InputLabel id="transfer-account-label">
                                                    Rekening Tujuan
                                                </InputLabel>
                                                <Select
                                                    labelId="transfer-account-label"
                                                    id="transfer-account"
                                                    value={
                                                        selectedTransferAccount
                                                    }
                                                    label="Rekening Tujuan"
                                                    onChange={(e) =>
                                                        setSelectedTransferAccount(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {transferToAccounts &&
                                                        transferToAccounts.map(
                                                            (acc) => (
                                                                <MenuItem
                                                                    key={acc.id}
                                                                    value={
                                                                        acc.id
                                                                    }
                                                                >
                                                                    {
                                                                        acc.bank
                                                                            ?.name
                                                                    }{" "}
                                                                    -{" "}
                                                                    {acc.number}{" "}
                                                                    - {acc.name}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                </Select>
                                            </FormControl>

                                            {/* Tampilkan upload bukti transfer jika rekening sudah dipilih dan Card ini tampil */}
                                            {selectedTransferAccount && (
                                                <Box mt={3}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        gutterBottom
                                                    >
                                                        Bukti Transfer
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        fullWidth
                                                    >
                                                        Upload Gambar
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={(e) =>
                                                                handleFileChange(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </Button>
                                                    {transferProof && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ mt: 1 }}
                                                        >
                                                            File:{" "}
                                                            {transferProof.name}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                <Card>
                                    {/* <CardHeader
                                            title={
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="h6">
                                                        Rencana Tanggal Pengiriman
                                                    </Typography>
                                                </Stack>
                                            }
                                        /> */}
                                    <CardContent>
                                        <TextField
                                            label="Tanggal Pengiriman"
                                            type="date"
                                            fullWidth
                                            value={deliveryDate}
                                            onChange={(e) =>
                                                setDeliveryDate(e.target.value)
                                            }
                                            InputProps={{
                                                inputProps: {
                                                    min: dayjs().format(
                                                        "YYYY-MM-DD"
                                                    ),
                                                },
                                            }}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader
                                        title={
                                            <Typography variant="h6">
                                                Ringkasan Belanja
                                            </Typography>
                                        }
                                    />
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <Typography>
                                                    Subtotal
                                                </Typography>
                                                <Typography>
                                                    Rp{" "}
                                                    {subtotal.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            {selectedDelivery &&
                                                selectedDelivery !== "33" &&
                                                shippingCostConfirmed && (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                    >
                                                        <Typography>
                                                            Ongkos Kirim
                                                        </Typography>
                                                        <Typography>
                                                            Rp{" "}
                                                            {shippingCostAmount.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {selectedDelivery &&
                                                selectedDelivery !== "33" &&
                                                !shippingCostConfirmed
                                                    ? "*) Silakan konfirmasi biaya pengiriman dengan admin"
                                                    : ""}
                                            </Typography>
                                            <Divider />
                                            <Box sx={{ width: "100%" }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "flex-start",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Grand Total
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "flex-end",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        color="primary"
                                                        sx={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Rp{" "}
                                                        {total.toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                startIcon={
                                                    <ShoppingCartCheckoutIcon />
                                                }
                                                fullWidth
                                                sx={{ mt: 2 }}
                                                disabled={
                                                    !selectedDelivery || // Metode pengiriman wajib dipilih
                                                    !selectedPaymentMethod || // Metode pembayaran wajib dipilih
                                                    (selectedPaymentMethod ===
                                                        "manual_transfer" && // Jika transfer manual:
                                                        (selectedDelivery ===
                                                            "33" ||
                                                            (selectedDelivery !==
                                                                "33" &&
                                                                shippingCostConfirmed &&
                                                                shippingPaymentMethod ===
                                                                    "via_us")) && // Hanya wajib jika self-pickup ATAU pengiriman, ongkir dikonfirmasi, dan bayar via kami
                                                        (!selectedTransferAccount ||
                                                            !transferProof)) || // Rekening tujuan & bukti transfer wajib jika kondisi di atas terpenuhi
                                                    (selectedDelivery !==
                                                        "33" && // Jika pengiriman (bukan ambil sendiri):
                                                        !selectedAddress) || // Alamat pengiriman wajib
                                                    (selectedDelivery !==
                                                        "33" &&
                                                        shippingCostConfirmed && // Jika pengiriman, ongkir dikonfirmasi:
                                                        shippingPaymentMethod ===
                                                            "via_us" &&
                                                        shippingCostAmount <= 0) // Jika bayar via kami, nominal ongkir > 0 wajib
                                                }
                                                onClick={handleCheckout}
                                            >
                                                Checkout
                                            </Button>
                                            {!selectedDelivery && (
                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                >
                                                    Silakan pilih metode
                                                    pengiriman.
                                                </Typography>
                                            )}
                                            {!selectedPaymentMethod && (
                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                >
                                                    Silakan pilih metode
                                                    pembayaran.
                                                </Typography>
                                            )}
                                            {showAddressSelection &&
                                                !selectedAddress && (
                                                    <Typography
                                                        variant="caption"
                                                        color="error"
                                                    >
                                                        Silakan pilih alamat
                                                        pengiriman.
                                                    </Typography>
                                                )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                )}
            </Box>

            {/* Address Dialog */}
            <Dialog
                open={openAddressDialog}
                onClose={handleCloseAddressDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            id="address-name"
                            label="Nama Alamat"
                            fullWidth
                            defaultValue={editingAddress?.name}
                        />
                        <TextField
                            id="recipient-name"
                            label="Nama Penerima"
                            fullWidth
                            defaultValue={editingAddress?.recipient_name}
                        />
                        <TextField
                            id="recipient-telp"
                            label="Nomor Telepon"
                            fullWidth
                            defaultValue={editingAddress?.recipient_telp_no}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Provinsi</InputLabel>
                            <Select
                                value={selectedProvince}
                                label="Provinsi"
                                onChange={handleProvinceChange}
                            >
                                {provinces.map((province) => (
                                    <MenuItem
                                        key={province.id}
                                        value={province.id}
                                    >
                                        {province.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Kota/Kabupaten</InputLabel>
                            <Select
                                value={selectedCity}
                                label="Kota/Kabupaten"
                                onChange={handleCityChange}
                                disabled={!selectedProvince}
                            >
                                {cities.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Kecamatan</InputLabel>
                            <Select
                                value={selectedDistrict}
                                label="Kecamatan"
                                onChange={handleDistrictChange}
                                disabled={!selectedCity}
                            >
                                {districts.map((district) => (
                                    <MenuItem
                                        key={district.id}
                                        value={district.id}
                                    >
                                        {district.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Kelurahan/Desa</InputLabel>
                            <Select
                                value={selectedSubdistrict}
                                label="Kelurahan/Desa"
                                onChange={handleSubdistrictChange}
                                disabled={!selectedDistrict}
                            >
                                {subdistricts.map((subdistrict) => (
                                    <MenuItem
                                        key={subdistrict.id}
                                        value={subdistrict.id}
                                    >
                                        {subdistrict.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Kode Pos"
                            fullWidth
                            value={postalCodeId}
                            onChange={(e) => setPostalCodeId(e.target.value)}
                            inputProps={{ maxLength: 5 }}
                            disabled={true}
                        />
                        <TextField
                            id="address-detail"
                            label="Alamat Lengkap"
                            fullWidth
                            multiline
                            rows={3}
                            defaultValue={editingAddress?.address}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddressDialog}>Batal</Button>
                    <Button
                        onClick={handleSaveAddress}
                        variant="contained"
                        disabled={
                            !selectedProvince ||
                            !selectedCity ||
                            !selectedDistrict ||
                            !selectedSubdistrict
                        }
                    >
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Shipping Cost Confirmation Modal */}
            <Dialog
                open={openShippingCostConfirmationModal}
                onClose={handleCancelShippingCost} // Close modal if cancelled
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Konfirmasi Biaya Pengiriman</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Apakah Anda sudah mengkonfirmasi biaya pengiriman dengan
                        admin?
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Jika ya, Anda bisa memasukkan nominal biaya pengiriman
                        di langkah selanjutnya. Jika belum, silakan hubungi
                        admin untuk mengkonfirmasi biaya pengiriman.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelShippingCost} color="error">
                        Belum Konfirmasi
                    </Button>
                    <Button
                        onClick={handleConfirmShippingCost}
                        variant="contained"
                    >
                        Sudah Konfirmasi
                    </Button>
                </DialogActions>
            </Dialog>

            <DeliveryAddressManagerModal
                open={openAddressManagerModal}
                onClose={handleCloseAddressManagerModal}
                deliveryAddresses={deliveryAddresses}
                selectedAddressId={selectedAddress}
                onSelectAddress={setSelectedAddress}
                provinces={provinces}
                cities={cities}
                districts={districts}
                subdistricts={subdistricts}
                handleProvinceChange={handleProvinceChange}
                handleCityChange={handleCityChange}
                handleDistrictChange={handleDistrictChange}
                handleSubdistrictChange={handleSubdistrictChange}
                selectedProvince={selectedProvince}
                selectedCity={selectedCity}
                selectedDistrict={selectedDistrict}
                selectedSubdistrict={selectedSubdistrict}
                postalCodeId={postalCodeId}
                setPostalCodeId={setPostalCodeId}
            />
        </AuthenticatedLayout>
    );
}
