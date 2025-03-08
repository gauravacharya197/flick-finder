export function formatAmount(input: string | number | null | undefined): string {
    if (input === null || input === undefined || input === 0 || input === "0") return "N/A"; // Handle invalid cases

    // Convert to string, remove non-numeric characters except dot (.)
    let numStr = input.toString().replace(/[^0-9.]/g, '');
    
    if (numStr === "") return "N/A"; // Handle empty string after cleanup

    const num = parseFloat(numStr);

    if (isNaN(num)) return "N/A"; // Handle non-numeric values

    let formatted: string;

    if (num >= 1_000_000_000) {
        formatted = (num / 1_000_000_000).toFixed(2);
        return parseFloat(formatted) + 'B';
    } else if (num >= 1_000_000) {
        formatted = (num / 1_000_000).toFixed(2);
        return parseFloat(formatted) + 'M';
    } else if (num >= 1_000) {
        formatted = (num / 1_000).toFixed(2);
        return parseFloat(formatted) + 'K';
    }

    return num.toString(); // Return the original number if below 1K
}

