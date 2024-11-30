export const findBestChargingSlot = (prices, options = {}) => {
  const {
    maxChargingHours = 12,      // Maximum charging hours (default: 12)
    minChargingHours = 3,       // Minimum charging hours (default: 3)
    latestStartHours = 8,       // Start charging within the next X hours (default: 8)
    priceHikeThreshold = 1.1,   // Stop if the price increases by more than 10% compared to cheapest duration
    minimumAvgPrice = 0.01      // Minimum average price to consider (default: 0.01 eur/kWh)
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

  console.log(chargingResults);

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

    if (currentAveragePrice > bestAveragePrice * priceHikeThreshold && currentAveragePrice >= minimumAvgPrice) {
      break;
    }

    bestResult = result;
  }

  console.log(bestResult);

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

  if (!bestStart) {
    return null
  } else {
    return {
      startTime: bestStart.toTimeString().substring(0, 5),
      endTime: bestEnd.toTimeString().substring(0, 5),
      averagePrice: bestAveragePrice.toFixed(4)
    };
  }
};

export const calculateAverageChargingPrice = (prices, startTimeDateString, endTimeDateString) => {
  const startDateTime = new Date(startTimeDateString);
  const endDateTime = new Date(endTimeDateString);

  if (endDateTime <= startDateTime) {
    return null;
  }

  const filteredPrices = prices
    .map(price => ({
      dateTime: new Date(price.DateTime),
      priceWithTax: price.PriceWithTax
    }))
    .filter(price => price.dateTime < endDateTime &&
      new Date(price.dateTime.getTime() + 60 * 60 * 1000) > startDateTime);

  const earliestCoveredTime = filteredPrices.length > 0 ? filteredPrices[0].dateTime : null;
  const latestCoveredTime = filteredPrices.length > 0
    ? new Date(filteredPrices[filteredPrices.length - 1].dateTime.getTime() + 60 * 60 * 1000)
    : null;

  if (!earliestCoveredTime || !latestCoveredTime || earliestCoveredTime > startDateTime || latestCoveredTime < endDateTime) {
    return null;
  }

  let totalWeightedPrice = 0;
  let totalDuration = 0;

  for (let i = 0; i < filteredPrices.length; i++) {
    const currentPrice = filteredPrices[i];
    const nextPriceTime = i + 1 < filteredPrices.length
      ? filteredPrices[i + 1].dateTime
      : new Date(currentPrice.dateTime.getTime() + 60 * 60 * 1000);

    const overlapStart = Math.max(startDateTime.getTime(), currentPrice.dateTime.getTime());
    const overlapEnd = Math.min(endDateTime.getTime(), nextPriceTime.getTime());

    const overlapDuration = (overlapEnd - overlapStart) / (60 * 60 * 1000);

    totalWeightedPrice += overlapDuration * currentPrice.priceWithTax;
    totalDuration += overlapDuration;
  }

  const averagePrice = totalWeightedPrice / totalDuration;

  return {
    averagePrice: parseFloat(averagePrice.toFixed(4)),
    totalDuration: totalDuration.toFixed(2) + ' hours'
  };
};
