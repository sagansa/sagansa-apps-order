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
    TextField,
    Stack,
    Tooltip,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import useMediaQuery from "@mui/material/useMediaQuery"; // Import useMediaQuery
import InfoIcon from "@mui/icons-material/Info";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import DeliveryAddressManagerModal from "@/Components/DeliveryAddressManagerModal";
import dayjs from "dayjs";
import axios from "axios";
import {
    getPriceByQuantity,
    getDiscountPercentage,
} from "@/Utils/cartCalculations";
import CartItemCard from "@/Components/cart/CartItemCard";
import DeliveryAddressDisplay from "@/Components/cart/DeliveryAddressDisplay";
import ShippingPaymentMethodSelector from "@/Components/cart/ShippingPaymentMethodSelector";
import PaymentMethodSelector from "@/Components/cart/PaymentMethodSelector";
import ManualTransferDetails from "@/Components/cart/ManualTransferDetails";
import OrderSummaryCard from "@/Components/cart/OrderSummaryCard";
import { brandBlack, brandGold } from "@/constants/colors";

export default function Cart({
    auth,
    cartItems,
    deliveryServices,
    deliveryAddresses,
    transferToAccounts,
    midtransMethods,
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
    const [postalCodeValue, setPostalCodeValue] = useState("");
    const [openAddressManagerModal, setOpenAddressManagerModal] =
        useState(false);
    const [selectedTransferAccount, setSelectedTransferAccount] = useState("");
    const [transferProof, setTransferProof] = useState(null); // This will hold the resized file
    const [previewUrl, setPreviewUrl] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState(
        dayjs().format("YYYY-MM-DD")
    );

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
    const [showWAButton, setShowWAButton] = useState(false);

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

    useEffect(() => {
        console.log("DEBUG: selectedPaymentMethod changed to:", selectedPaymentMethod);
    }, [selectedPaymentMethod]);

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
        setPostalCodeId("");
        setPostalCodeValue("");
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
        setPostalCodeId("");
        setPostalCodeValue("");
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
        setPostalCodeId("");
        setPostalCodeValue("");
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
        setPostalCodeId("");
        setPostalCodeValue("");

        if (subdistrictId) {
            fetch(
                route("locations.postal-code", {
                    subdistrict_id: subdistrictId,
                })
            )
                .then((response) => response.json())
                .then((data) => {
                    setPostalCodeId(data?.id || "");
                    setPostalCodeValue(data?.postal_code || "");
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
                    quantity,
                    item.product?.online_price || 0
                );
                return total + pricePerUnit * quantity;
            }, 0) || 0
        );
    };

    const subtotal = calculateSubtotal();
    const normalizedShippingCostAmount = Number(shippingCostAmount) || 0;


    // Calculate total including shipping cost and Midtrans fee if applicable
    const total =
        selectedDelivery &&
        selectedDelivery !== "33" &&
        shippingCostConfirmed &&
        shippingPaymentMethod === "via_us"
            ? subtotal + normalizedShippingCostAmount
            : subtotal;

    const handleDeliveryChange = (e) => {
        const serviceId = e.target.value;
        setSelectedDelivery(serviceId);
        // Reset selected address when delivery service changes
        setSelectedAddress("");

        // Hide WA button if pickup is selected
        if (serviceId === "33") {
            setShowWAButton(false);
        }

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
        setPostalCodeId(address.postal_code_id || "");
        setPostalCodeValue(address.postal_code?.postal_code || "");

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
            ?.id != 33; // Use non-strict comparison or integer to catch both string and integer IDs

    // Handler untuk konfirmasi ongkir
    const handleConfirmShippingCost = () => {
        setShippingCostConfirmed(true);
        setOpenShippingCostConfirmationModal(false);
        setShowWAButton(false); // Hide button if confirmed
    };

    const handleCancelShippingCost = () => {
        setShippingCostConfirmed(false);
        setShippingCostAmount(0); // Reset amount if not confirmed
        setOpenShippingCostConfirmationModal(false);
        setSelectedDelivery(""); // Reset delivery selection as well if cancelled
        setShowWAButton(true); // Show button ONLY when explicitly unconfirmed
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // --- Start Processing ---
        setIsProcessing(true);

        try {
            // --- Form Data Assembly ---
            const isSelfPickup = selectedDelivery === "33";
            const deliveryMethod = deliveryServices.find(
                (service) => service.id.toString() === selectedDelivery
            );
            const isDelivery = deliveryMethod && deliveryMethod.id != 33;

            // Validasi untuk Transfer Manual
            if (selectedPaymentMethod === "manual_transfer") {
                if (
                    isSelfPickup ||
                    (isDelivery &&
                        shippingCostConfirmed &&
                        shippingPaymentMethod === "via_us")
                ) {
                    if (!selectedTransferAccount) {
                        alert("Mohon pilih rekening tujuan transfer.");
                        setIsProcessing(false);
                        return;
                    }
                    if (!transferProof) {
                        alert("Mohon upload bukti transfer.");
                        setIsProcessing(false);
                        return;
                    }
                }
            }

            // Kondisi 2 (Bayar Via Kami): Perlu nominal ongkir > 0 jika Pengiriman + Ongkir Sudah Konfirmasi + Bayar Via Kami
            if (
                isDelivery &&
                shippingCostConfirmed &&
                shippingPaymentMethod === "via_us" &&
                normalizedShippingCostAmount <= 0
            ) {
                alert(
                    "Mohon masukkan nominal biaya pengiriman yang valid (lebih dari 0) jika dibayarkan melalui kami."
                );
                setIsProcessing(false);
                return;
            }

            // Kondisi: Perlu Alamat Pengiriman jika Pengiriman
            if (isDelivery && !selectedAddress) {
                alert("Mohon pilih alamat pengiriman.");
                setIsProcessing(false);
                return;
            }

            const formData = new FormData();
            formData.append("delivery_service_id", selectedDelivery);

            if (isDelivery) {
                formData.append("delivery_address_id", selectedAddress);
            }

            formData.append(
                "transfer_to_account_id",
                selectedTransferAccount || ""
            );

            if (transferProof) {
                formData.append("image_payment", transferProof);
            }

            formData.append("delivery_date", deliveryDate);

            const finalShippingCostForBackend =
                isDelivery &&
                shippingCostConfirmed &&
                shippingPaymentMethod === "via_us"
                    ? normalizedShippingCostAmount
                    : 0;

            formData.append("shipping_cost", finalShippingCostForBackend);

            // Logika penentuan status pembayaran
            let paymentStatus;
            if (isSelfPickup) {
                paymentStatus = transferProof ? 1 : 4;
            } else if (isDelivery && shippingCostConfirmed) {
                paymentStatus = 1;
            } else if (isDelivery && !shippingCostConfirmed) {
                paymentStatus = 4;
            } else {
                paymentStatus = 4;
            }

            formData.append("shipping_payment_method", shippingPaymentMethod);
            formData.append("payment_status", paymentStatus);
            formData.append("payment_method", selectedPaymentMethod);

            // Ubah format items
            const items = cartItems.map((item) => ({
                product_id: item.product.id,
                quantity: quantities[item.id] || item.quantity,
                price: getPriceByQuantity(
                    item.product?.price_tiers,
                    quantities[item.id] || item.quantity,
                    item.product?.online_price || 0
                ),
            }));

            items.forEach((item, index) => {
                formData.append(`items[${index}][product_id]`, item.product_id);
                formData.append(`items[${index}][quantity]`, item.quantity);
                formData.append(`items[${index}][price]`, item.price);
            });

            // --- API Call ---
            if (selectedPaymentMethod !== "manual_transfer") {
                const response = await axios.post(
                    route("cart.checkout"),
                    formData
                );
                const { snap_token, order_id } = response.data;

                window.snap.pay(snap_token, {
                    onSuccess: function (result) {
                        router.visit(route("transaction.history"));
                    },
                    onPending: function (result) {
                        router.visit(route("transaction.history"));
                    },
                    onError: function (result) {
                        alert("Pembayaran gagal!");
                    },
                    onClose: function () {
                        alert("Anda menutup popup tanpa menyelesaikan pembayaran.");
                        router.visit(route("transaction.history"));
                    },
                });
            } else {
                router.post(route("cart.checkout"), formData, {
                    onError: (errors) => {
                        console.error("Error:", errors);
                        const errorString = Object.values(errors).join("\n");
                        alert(
                            `Terjadi kesalahan saat checkout:\n${errorString}`
                        );
                    },
                    onFinish: () => setIsProcessing(false),
                });
            }
        } catch (error) {
            console.error("Unhandled checkout error:", error);
            alert("Terjadi kesalahan yang tidak terduga.");
            setIsProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{ color: "text.primary", fontWeight: "bold" }}
                >
                    Checkout
                </Typography>
            }
        >
            <Head title="Checkout" />

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
                                    <DeliveryAddressDisplay
                                        selectedAddressObject={deliveryAddresses.find(
                                            (address) =>
                                                address.id.toString() ===
                                                selectedAddress
                                        )}
                                    />
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
                                        <CartItemCard
                                            key={item.id}
                                            item={item}
                                            quantities={quantities}
                                            handleQuantityChange={
                                                handleQuantityChange
                                            }
                                            handleQuantityInput={
                                                handleQuantityInput
                                            }
                                            handleDeleteItem={handleDeleteItem}
                                            isMobile={isMobile}
                                        />
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
                                    {showWAButton && !shippingCostConfirmed && (
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<WhatsAppIcon />}
                                            href={`https://wa.me/6285782004645?text=${encodeURIComponent(
                                                "Halo Sagansa, saya ingin konfirmasi pesanan saya dan menanyakan biaya pengiriman."
                                            )}`}
                                            target="_blank"
                                            sx={{
                                                mt: 2,
                                                mb: 1,
                                                py: 1,
                                                borderRadius: 2,
                                                fontWeight: "bold",
                                                borderColor: "#25D366",
                                                color: "#25D366",
                                                "&:hover": {
                                                    borderColor: "#128C7E",
                                                    bgcolor:
                                                        "rgba(37, 211, 102, 0.05)",
                                                },
                                            }}
                                        >
                                            Chat WA Admin
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Tampilkan input nominal ongkir jika sudah dikonfirmasi (tidak self-pickup) */}
                            {selectedDelivery &&
                                selectedDelivery !== "33" &&
                                shippingCostConfirmed && (
                                    <ShippingPaymentMethodSelector
                                        shippingPaymentMethod={
                                            shippingPaymentMethod
                                        }
                                        setShippingPaymentMethod={
                                            setShippingPaymentMethod
                                        }
                                        shippingCostAmount={shippingCostAmount}
                                        setShippingCostAmount={
                                            setShippingCostAmount
                                        }
                                    />
                                )}

                            {/* Card Metode Pembayaran */}
                            <PaymentMethodSelector
                                selectedPaymentMethod={selectedPaymentMethod}
                                setSelectedPaymentMethod={
                                    setSelectedPaymentMethod
                                }
                                midtransMethods={midtransMethods}
                                subtotal={subtotal}
                                shippingCostAmount={shippingCostAmount}
                            />

                            {/* Card Pilih Rekening Tujuan Transfer (Hanya jika Transfer Manual dipilih DAN (Ambil Sendiri ATAU Pengiriman + Ongkir Konfirmasi)) */}
                            {selectedPaymentMethod === "manual_transfer" && (
                                <ManualTransferDetails
                                    selectedTransferAccount={
                                        selectedTransferAccount
                                    }
                                    setSelectedTransferAccount={
                                        setSelectedTransferAccount
                                    }
                                    transferToAccounts={transferToAccounts}
                                    transferProof={transferProof}
                                    handleFileChange={handleFileChange}
                                />
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

                            <OrderSummaryCard
                                subtotal={subtotal}
                                selectedDelivery={selectedDelivery}
                                shippingCostConfirmed={shippingCostConfirmed}
                                shippingPaymentMethod={shippingPaymentMethod}
                                shippingCostAmount={shippingCostAmount}
                                total={total}
                                handleCheckout={handleCheckout}
                                isProcessing={isProcessing}
                                selectedPaymentMethod={selectedPaymentMethod}
                                selectedTransferAccount={
                                    selectedTransferAccount
                                }
                                transferProof={transferProof}
                                showAddressSelection={showAddressSelection}
                                selectedAddress={selectedAddress}
                                deliveryServices={deliveryServices}
                                midtransMethods={midtransMethods}
                            />
                        </Stack>
                    </Stack>
                ) : (
                    <Grid container spacing={3} flexWrap="nowrap">
                        <Grid size={8}>
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
                                        <DeliveryAddressDisplay
                                            selectedAddressObject={deliveryAddresses.find(
                                                (address) =>
                                                    address.id.toString() ===
                                                    selectedAddress
                                            )}
                                        />
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
                                                            <CartItemCard
                                                                item={item}
                                                                quantities={
                                                                    quantities
                                                                }
                                                                handleQuantityChange={
                                                                    handleQuantityChange
                                                                }
                                                                handleQuantityInput={
                                                                    handleQuantityInput
                                                                }
                                                                handleDeleteItem={
                                                                    handleDeleteItem
                                                                }
                                                                isMobile={
                                                                    isMobile
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={4}>
                            <Stack spacing={3}>
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
                                        {showWAButton && !shippingCostConfirmed && (
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                startIcon={<WhatsAppIcon />}
                                                href={`https://wa.me/6285782004645?text=${encodeURIComponent(
                                                    "Halo Sagansa, saya ingin konfirmasi pesanan saya dan menanyakan biaya pengiriman."
                                                )}`}
                                                target="_blank"
                                                sx={{
                                                    mt: 2,
                                                    mb: 1,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    fontWeight: "bold",
                                                    borderColor: "#25D366",
                                                    color: "#25D366",
                                                    "&:hover": {
                                                        borderColor: "#128C7E",
                                                        bgcolor:
                                                            "rgba(37, 211, 102, 0.05)",
                                                    },
                                                }}
                                            >
                                                Chat WA Admin
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Tampilkan input nominal ongkir jika sudah dikonfirmasi (tidak self-pickup) */}
                                {selectedDelivery &&
                                    selectedDelivery !== "33" &&
                                    shippingCostConfirmed && (
                                        <ShippingPaymentMethodSelector
                                            shippingPaymentMethod={
                                                shippingPaymentMethod
                                            }
                                            setShippingPaymentMethod={
                                                setShippingPaymentMethod
                                            }
                                            shippingCostAmount={
                                                shippingCostAmount
                                            }
                                            setShippingCostAmount={
                                                setShippingCostAmount
                                            }
                                        />
                                    )}

                                {/* Card Metode Pembayaran */}
                                <PaymentMethodSelector
                                    selectedPaymentMethod={
                                        selectedPaymentMethod
                                    }
                                    setSelectedPaymentMethod={
                                        setSelectedPaymentMethod
                                    }
                                    midtransMethods={midtransMethods}
                                    subtotal={subtotal}
                                    shippingCostAmount={shippingCostAmount}
                                />

                                {/* Card Pilih Rekening Tujuan Transfer (Hanya jika Transfer Manual dipilih DAN (Ambil Sendiri ATAU Pengiriman + Ongkir Konfirmasi)) */}
                                {selectedPaymentMethod ===
                                    "manual_transfer" && (
                                    <ManualTransferDetails
                                        selectedTransferAccount={
                                            selectedTransferAccount
                                        }
                                        setSelectedTransferAccount={
                                            setSelectedTransferAccount
                                        }
                                        transferToAccounts={transferToAccounts}
                                        handleFileChange={handleFileChange}
                                        transferProof={transferProof}
                                    />
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

                                <OrderSummaryCard
                                    subtotal={subtotal}
                                    selectedDelivery={selectedDelivery}
                                    shippingCostConfirmed={
                                        shippingCostConfirmed
                                    }
                                    shippingPaymentMethod={
                                        shippingPaymentMethod
                                    }
                                    shippingCostAmount={shippingCostAmount}
                                    total={total}
                                    handleCheckout={handleCheckout}
                                    isProcessing={isProcessing}
                                    selectedPaymentMethod={
                                        selectedPaymentMethod
                                    }
                                    selectedTransferAccount={
                                        selectedTransferAccount
                                    }
                                    transferProof={transferProof}
                                    showAddressSelection={showAddressSelection}
                                    selectedAddress={selectedAddress}
                                    deliveryServices={deliveryServices}
                                    midtransMethods={midtransMethods}
                                />
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
                            value={postalCodeValue}
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
                postalCodeValue={postalCodeValue}
                setPostalCodeValue={setPostalCodeValue}
            />
        </AuthenticatedLayout>
    );
}
