export const findBestChargingSlot = (prices, options = {}) => {
  const {
    maxChargingHours = 12,      // Maximum charging hours (default: 12)
    minChargingHours = 3,       // Minimum charging hours (default: 3)
    latestStartHours = 8,       // Start charging within the next X hours (default: 8)
    priceHikeThreshold = 1.1    // Stop if the price increases by more than 10% compared to cheapest duration
  } = options;

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Filter and map prices to exclude past prices and prices beyond 24 hours
  const filteredPrices = prices
    .map(price => ({
      dateTime: new Date(price.DateTime),
      priceWithTax: price.PriceWithTax
    }))
    .filter(price => price.dateTime > now && price.dateTime <= tomorrow);

  if (filteredPrices.length === 0) {
    return null;
  }

  const chargingResults = [];

  for (let hours = minChargingHours; hours <= maxChargingHours; hours++) {
    const result = calculateCharging(filteredPrices, hours, latestStartHours);
    if (result) {
      chargingResults.push({ ...result, duration: hours });
    }
  }

  // Find the longest reasonably cheap charging duration
  let bestResult = null;
  let bestAveragePrice = null;

  for (const result of chargingResults) {
    const currentAveragePrice = parseFloat(result.averagePrice);

    if (!bestAveragePrice) {
      bestAveragePrice = currentAveragePrice;
      bestResult = result;
      continue;
    }

    if (currentAveragePrice > bestAveragePrice * priceHikeThreshold) {
      break;
    }

    bestResult = result;
  }

  return bestResult;
};

const calculateCharging = (prices, maxChargingHours, latestStartHours) => {
  let bestStart = null;
  let bestEnd = null;
  let bestAveragePrice = Infinity;

  for (let i = 0; i <= Math.min(latestStartHours - 1, prices.length - maxChargingHours); i++) {
    let totalPrice = 0;

    for (let j = 0; j < maxChargingHours; j++) {
      totalPrice += prices[i + j].priceWithTax;
    }

    const averagePrice = totalPrice / maxChargingHours;

    if (averagePrice < bestAveragePrice) {
      bestAveragePrice = averagePrice;
      bestStart = prices[i].dateTime;
      bestEnd = new Date(bestStart.getTime() + maxChargingHours * 60 * 60 * 1000);
    }
  }

  return {
    startTime: bestStart.toTimeString().substring(0, 5),
    endTime: bestEnd.toTimeString().substring(0, 5),
    averagePrice: bestAveragePrice.toFixed(4)
  };
};
