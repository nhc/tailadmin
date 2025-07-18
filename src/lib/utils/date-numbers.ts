export const formatPrice = (price: number, currency: string = "USD") => {
  // Convert from cents to dollars (price is stored as integer in smallest currency unit)
  const priceInDollars = price / 100;

  let region = "en-GB";

  switch (currency) {
    case "USD":
      region = "en-US";
      break;
    case "GBP":
      region = "en-GB";
      break;
    case "EUR":
      region = "en-EU";
      break;
    default:
      region = "en-GB";
  }

  return new Intl.NumberFormat(region, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceInDollars);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
