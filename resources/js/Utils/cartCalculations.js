export const getPriceByQuantity = (priceTiers, quantity, fallbackPrice = 0) => {
    if (!priceTiers || priceTiers.length === 0) return fallbackPrice;

    const tier = priceTiers.find(
        (tier) =>
            quantity >= tier.min_quantity &&
            (tier.max_quantity === null || quantity <= tier.max_quantity)
    );

    return tier ? tier.price : priceTiers[0].price;
};

export const getDiscountPercentage = (priceTiers, quantity) => {
    if (!priceTiers || priceTiers.length === 0) return 0;

    const basePrice = priceTiers[0].price;
    const currentPrice = getPriceByQuantity(priceTiers, quantity);
    return Math.round(((basePrice - currentPrice) / basePrice) * 100);
};
