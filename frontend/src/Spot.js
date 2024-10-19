export const fetchSpotPrices = async (setMessage) => {
    try {
        const response = await fetch('https://api.spot-hinta.fi/TodayAndDayForward');
        if (response.ok) {
            return await response.json();
        } else {
            setMessage('Error: Unable to fetch spot prices');
            return null;
        }
    } catch (error) {
        setMessage('Error: Unable to fetch spot prices');
        return null;
    }
};
