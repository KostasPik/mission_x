
function formatMeasurementTitle(title) {
    if (!title)
        return '';

    // Remove extra spaces
    title = title.trim();
    
    // Remove special characters and replace them with spaces
    let formattedTitle = title.replace(/[^a-zA-Z0-9]+/g, ' ');

    // Split the title into words
    let words = formattedTitle.split(' ');

    // Capitalize the first letter of each word
    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Join the words with spaces
    formattedTitle = words.join(' ');

    return formattedTitle;
}

function formatTimestamp(timestamp) {

    const date = new Date(timestamp);
    
    /* Check if timestamp is valid */
    if (isNaN(date.getTime()))
        return "this timestamp is invalid."

    // Format the date components
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    
    // Construct the human-readable date string
    const readableDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    return readableDate; // Output: 2024-03-29 22:15:35
}

export {formatMeasurementTitle, formatTimestamp};