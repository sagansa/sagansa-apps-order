import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Typography,
    Button,
    TextField,
    IconButton,
    Box,
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
import InfoIcon from "@mui/icons-material/Info";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { getPriceByQuantity } from "@/Utils/cartCalculations";
import SectionCard from "@/Components/ui/SectionCard";
import CartItemCard from "@/Components/cart/CartItemCard";
import DeliveryAddressDisplay from "@/Components/cart/DeliveryAddressDisplay";
import DeliveryAddressManagerModal from "@/Components/DeliveryAddressManagerModal";
import ShippingPaymentMethodSelector from "@/Components/cart/ShippingPaymentMethodSelector";
import PaymentMethodSelector from "@/Components/cart/PaymentMethodSelector";
import CreditCardForm from "@/Components/cart/CreditCardForm";
import ManualTransferDetails from "@/Components/cart/ManualTransferDetails";
import OrderSummaryCard from "@/Components/cart/OrderSummaryCard";

export default function Cart({
    auth,
    cartItems,
    deliveryServices,
    deliveryAddresses,
    transferToAccounts,
    midtransMethods,
}) {
    const [quantities, setQuantities] = useState(
        cartItems?.reduce(
            (acc, item) => ({ ...acc, [item.id]: item.quantity }),
            {}
        )
    );
    const [selectedDelivery, setSelectedDelivery] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
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
    const [transferProof, setTransferProof] = useState(null); // File hasil resize
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
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

    // Buka modal konfirmasi ongkir setiap kali delivery service berubah
    useEffect(() => {
        const isSelfPickup = selectedDelivery === "33";
        if (!isSelfPickup && selectedDelivery !== "") {
            setOpenShippingCostConfirmationModal(true);
        } else {
            setShippingCostConfirmed(false);
            setShippingCostAmount(0);
            setOpenShippingCostConfirmationModal(false);
        }
    }, [selectedDelivery]);

    const handleDeliveryChange = (e) => {
        const serviceId = e.target.value;
        setSelectedDelivery(serviceId);
        // Reset alamat terpilih saat delivery service berubah
        setSelectedAddress("");

        if (serviceId === "33") {
            setShowWAButton(false);
        }
        // Effect di atas akan menangani modal/reset konfirmasi ongkir
    };

    const showAddressSelection =
        selectedDelivery &&
        deliveryServices.find((s) => s.id === parseInt(selectedDelivery))
            ?.id != 33;

    // Handler untuk konfirmasi ongkir
    const handleConfirmShippingCost = () => {
        setShippingCostConfirmed(true);
        setOpenShippingCostConfirmationModal(false);
        setShowWAButton(false);
    };

    const handleCancelShippingCost = () => {
        setShippingCostConfirmed(false);
        setShippingCostAmount(0);
        setOpenShippingCostConfirmationModal(false);
        setSelectedDelivery("");
        setShowWAButton(true);
    };

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
            fetch(
                route("locations.subdistricts", {
                    district_id: districtId,
                })
            )
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

    // Resize gambar bukti transfer sebelum upload (maks 800px, kualitas 70%)
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
                const MAX_SIZE = 800;
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
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        setTransferProof(resizedFile);
                    },
                    file.type,
                    0.7
                );
            };
        };
        reader.readAsDataURL(file);
    };

    const handleQuantityChange = (itemId, change) => {
        const item = cartItems.find((i) => i.id === itemId);
        const stock =
            item?.product?.current_stock ??
            item?.product_online_group?.current_stock;
        const currentQty = quantities[itemId] || 1;
        const newQuantity = Math.max(1, currentQty + change);

        if (stock !== null && stock !== undefined && newQuantity > stock) {
            return;
        }

        setQuantities((prev) => ({
            ...prev,
            [itemId]: newQuantity,
        }));

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
        const item = cartItems.find((i) => i.id === itemId);
        const stock =
            item?.product?.current_stock ??
            item?.product_online_group?.current_stock;
        let newValue = parseInt(value) || 1;

        if (stock !== null && stock !== undefined && newValue > stock) {
            newValue = stock;
        }

        const validValue = Math.max(1, newValue);

        setQuantities((prev) => ({
            ...prev,
            [itemId]: validValue,
        }));

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
                // Relasi productOnlineGroup terserialisasi snake_case.
                const resolved = item.product_online_group || item.product || {};
                const pricePerUnit = getPriceByQuantity(
                    resolved.priceTiers ?? resolved.price_tiers,
                    quantity,
                    resolved.online_price || 0
                );
                return total + pricePerUnit * quantity;
            }, 0) || 0
        );
    };

    const subtotal = calculateSubtotal();
    const normalizedShippingCostAmount = Number(shippingCostAmount) || 0;

    // Total termasuk ongkir (via_us) — biaya layanan Midtrans dihitung
    // di OrderSummaryCard dan ditambahkan di tampilan Grand Total.
    const total =
        selectedDelivery &&
        selectedDelivery !== "33" &&
        shippingCostConfirmed &&
        shippingPaymentMethod === "via_us"
            ? subtotal + normalizedShippingCostAmount
            : subtotal;

    const [isProcessing, setIsProcessing] = useState(false);
    const creditCardFormRef = useRef(null);

    const handleCheckout = async (event) => {
        event.preventDefault();

        setIsProcessing(true);

        try {
            const isSelfPickup = selectedDelivery === "33";
            const deliveryMethod = deliveryServices.find(
                (service) => service.id.toString() === selectedDelivery
            );
            const isDelivery = deliveryMethod && deliveryMethod.id != 33;

            // Validasi untuk Transfer Manual
            if (selectedPaymentMethod === "manual_transfer") {
                if (isSelfPickup || (isDelivery && shippingCostConfirmed)) {
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

            // Ongkir via_us wajib nominal > 0
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

            // Alamat wajib untuk pengiriman
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

            // "Dibayar" hanya jika bukti transfer benar-benar diupload;
            // tanpa bukti tetap "Belum dibayar" (bayar nanti).
            let paymentStatus;
            if (selectedPaymentMethod !== "manual_transfer") {
                paymentStatus = 4; // backend memaksa 4 untuk Midtrans
            } else if (isSelfPickup || (isDelivery && shippingCostConfirmed)) {
                paymentStatus = transferProof ? 1 : 4;
            } else {
                paymentStatus = 4;
            }

            formData.append("shipping_payment_method", shippingPaymentMethod);
            formData.append("payment_status", paymentStatus);
            formData.append("payment_method", selectedPaymentMethod);

            // Buang baris keranjang yang produk/grupnya sudah tidak valid
            // (relasi null), lalu pastikan masih ada item.
            const items = cartItems
                .map((item) => {
                    const resolved =
                        item.product_online_group || item.product || {};
                    return {
                        product_id: item.product ? item.product.id : null,
                        product_online_group_id: item.product_online_group
                            ? item.product_online_group.id
                            : null,
                        quantity: quantities[item.id] || item.quantity,
                        price: getPriceByQuantity(
                            resolved.priceTiers ?? resolved.price_tiers,
                            quantities[item.id] || item.quantity,
                            resolved.online_price || 0
                        ),
                    };
                })
                .filter(
                    (item) => item.product_id || item.product_online_group_id
                );

            if (items.length === 0) {
                alert(
                    "Tidak ada produk yang valid di keranjang. Silakan hapus item yang tidak valid lalu coba lagi."
                );
                setIsProcessing(false);
                return;
            }

            items.forEach((item, index) => {
                if (item.product_id) {
                    formData.append(`items[${index}][product_id]`, item.product_id);
                }
                if (item.product_online_group_id) {
                    formData.append(
                        `items[${index}][product_online_group_id]`,
                        item.product_online_group_id
                    );
                }
                formData.append(`items[${index}][quantity]`, item.quantity);
                formData.append(`items[${index}][price]`, item.price);
            });

            if (selectedPaymentMethod !== "manual_transfer") {
                if (selectedPaymentMethod === "credit_card") {
                    if (!creditCardFormRef.current) {
                        alert("Form kartu kredit belum siap.");
                        setIsProcessing(false);
                        return;
                    }
                    const token = await creditCardFormRef.current.getToken();
                    if (!token) {
                        setIsProcessing(false);
                        return;
                    }
                    formData.append("card_token", token);
                }

                const response = await axios.post(
                    route("cart.checkout"),
                    formData
                );
                const { order_id } = response.data;

                router.visit(route("checkout.success", { order: order_id }));
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

    const selectedAddressObject = deliveryAddresses.find(
        (address) => address.id.toString() === selectedAddress
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: 800, color: "white", lineHeight: 1.1 }}
                >
                    Checkout
                </Typography>
            }
        >
            <Head title="Checkout" />

            <Box sx={{ py: { xs: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
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
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                        >
                            Pilih produk dari katalog untuk mulai membuat
                            pesanan.
                        </Typography>
                        <Button
                            variant="contained"
                            href={route("order.index")}
                            sx={{
                                mt: 1,
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 700,
                                background:
                                    "linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)",
                                boxShadow:
                                    "0 8px 16px rgba(198, 169, 107, 0.2)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)",
                                },
                            }}
                        >
                            Mulai Belanja
                        </Button>
                    </Stack>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "minmax(0, 1fr) 400px",
                            },
                            gap: 3,
                            alignItems: "start",
                        }}
                    >
                        {/* KOLOM KIRI — pesanan: barang, alamat, pengiriman */}
                        <Stack spacing={3} sx={{ minWidth: 0 }}>
                            <SectionCard
                                title={`Daftar Produk (${cartItems?.length || 0} item)`}
                                icon={Inventory2Icon}
                                action={
                                    <Tooltip title="Harga akan menurun sesuai dengan jumlah pembelian">
                                        <IconButton size="small">
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
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
                                            handleDeleteItem={
                                                handleDeleteItem
                                            }
                                        />
                                    ))}
                                </Stack>
                            </SectionCard>

                            {showAddressSelection && (
                                <SectionCard
                                    title="Alamat Pengiriman"
                                    icon={LocalShippingIcon}
                                    action={
                                        <Button
                                            startIcon={<LocationOnIcon />}
                                            onClick={
                                                handleOpenAddressManagerModal
                                            }
                                            size="small"
                                            sx={{
                                                color: "#8f7949",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {selectedAddress
                                                ? "Ubah Alamat"
                                                : "Pilih Alamat"}
                                        </Button>
                                    }
                                >
                                    <DeliveryAddressDisplay
                                        selectedAddressObject={
                                            selectedAddressObject
                                        }
                                    />
                                </SectionCard>
                            )}

                            <SectionCard
                                title="Metode Pengiriman"
                                icon={LocalShippingIcon}
                            >
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
                                        sx={{ borderRadius: 2 }}
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
                            </SectionCard>

                            {/* Input nominal ongkir setelah konfirmasi (bukan self-pickup) */}
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

                            <SectionCard
                                title="Tanggal Pengiriman"
                                icon={EventIcon}
                            >
                                <TextField
                                    label="Tanggal Pengiriman"
                                    type="date"
                                    fullWidth
                                    value={deliveryDate}
                                    onChange={(e) =>
                                        setDeliveryDate(e.target.value)
                                    }
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                        },
                                    }}
                                    InputProps={{
                                        inputProps: {
                                            min: dayjs().format("YYYY-MM-DD"),
                                        },
                                    }}
                                />
                            </SectionCard>
                        </Stack>

                        {/* KOLOM KANAN — pembayaran + ringkasan */}
                        <Box
                            sx={{
                                position: { md: "sticky" },
                                top: { md: 24 },
                                display: "grid",
                                gap: 3,
                            }}
                        >
                            <PaymentMethodSelector
                                selectedPaymentMethod={selectedPaymentMethod}
                                setSelectedPaymentMethod={
                                    setSelectedPaymentMethod
                                }
                                midtransMethods={midtransMethods}
                                subtotal={subtotal}
                                shippingCostAmount={shippingCostAmount}
                            />

                            {selectedPaymentMethod === "credit_card" && (
                                <CreditCardForm
                                    ref={creditCardFormRef}
                                    disabled={isProcessing}
                                />
                            )}

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
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Modal Konfirmasi Biaya Pengiriman */}
            <Dialog
                open={openShippingCostConfirmationModal}
                onClose={handleCancelShippingCost}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Konfirmasi Biaya Pengiriman</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Apakah Anda sudah mengkonfirmasi biaya pengiriman
                        dengan admin?
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

            {/* Modal pilih/kelola alamat — dialog tambah/edit ada di dalamnya */}
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
