export const findBestChargingSlot = (prices, options = {}) => {
  const {
    lowPriceMultiplier = 0.7,   // Low price threshold multiplier (default: 70% of average)
    priceHikeThreshold = 1.2,   // Price hike threshold (default: 20% hike)
    maxChargingHours = 12,      // Maximum charging hours (default: 12)
    latestStartHours = 8        // Start charging within the next X hours (default: 8)
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

  let bestResult = null;
  let previousAveragePrice = Infinity;

  const totalPrices = filteredPrices.length;
  const totalPriceSum = filteredPrices.reduce((acc, price) => acc + price.priceWithTax, 0);
  const averagePrice = totalPriceSum / totalPrices;
  const lowPriceThreshold = averagePrice * lowPriceMultiplier;

  for (let hours = 1; hours <= maxChargingHours; hours++) {
    const result = calculateCharging(filteredPrices, hours, latestStartHours);

    if (result) {
      const currentAveragePrice = parseFloat(result.averagePrice);

      // Check if the current result is better or meets the "low price" condition
      if (!bestResult || (currentAveragePrice < bestResult.averagePrice) || (currentAveragePrice < lowPriceThreshold)) {
        bestResult = { ...result, duration: hours };
      }

      // Stop if the price hikes by more than the priceHikeThreshold and is above the low price threshold
      if (currentAveragePrice > previousAveragePrice * priceHikeThreshold && currentAveragePrice > lowPriceThreshold) {
        break;
      }

      previousAveragePrice = currentAveragePrice;
    }
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
