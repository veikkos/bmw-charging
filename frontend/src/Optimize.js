export const findBestChargingSlot = (prices) => {
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
  const lowPriceThreshold = averagePrice * 0.8; // Set "low price" to 80% of the average price

  for (let hours = 1; hours <= 12; hours++) {
    const result = calculateCharging(filteredPrices, hours);

    if (result) {
      const currentAveragePrice = parseFloat(result.averagePrice);

      // Check if the current result is better or meets the "low price" condition
      if (!bestResult || (currentAveragePrice < bestResult.averagePrice) || (currentAveragePrice < lowPriceThreshold)) {
        bestResult = { ...result, duration: hours };
      }

      // Stop if the price hikes by more than 20% and is above the low price threshold
      if (currentAveragePrice > previousAveragePrice * 1.2 && currentAveragePrice > lowPriceThreshold) {
        break;
      }

      previousAveragePrice = currentAveragePrice;
    }
  }

  return bestResult;
};

const calculateCharging = (prices, maxChargingHours) => {
  let bestStart = null;
  let bestEnd = null;
  let bestAveragePrice = Infinity;

  for (let i = 0; i <= prices.length - maxChargingHours; i++) {
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
