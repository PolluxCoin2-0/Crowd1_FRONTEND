import axios from "axios";

const FULL_NODE_TRANSACTION_URL = import.meta.env.VITE_FULL_NODE_TRANSACTION_URL || "";

export const checkTransactionStatus = async (trxHash) => {
  const MAX_ATTEMPTS = 3; // Maximum number of retry attempts
  const DELAY = 3000; // Delay between attempts in milliseconds

  let attempt = 0; // Counter for attempts
  let verify = null; // To store the transaction verification status

  // Validate input
  if (!trxHash) {
    console.error("Transaction hash is required.");
    return null;
  }

  while (attempt < MAX_ATTEMPTS) {
    try {
      const response = await axios.post(
        `${FULL_NODE_TRANSACTION_URL}/wallet/gettransactioninfobyid`,
        { value: trxHash }
      );

      if (response && response.data) {
        const data = response.data;

        // Log response for debugging
        console.log(`Attempt ${attempt + 1} - Response data:`, data);

        // Check if `receipt` exists and has a `result` field
        if (data.receipt && typeof data.receipt.result !== "undefined") {
          verify = data.receipt.result;
          console.log("Transaction receipt found:", verify);
          break; // Exit loop on successful verification
        }
      } else {
        console.warn(`Attempt ${attempt + 1} - Response is invalid.`);
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed with error:`, error.message);
    }

    attempt++;
    if (attempt < MAX_ATTEMPTS) {
      console.log(`Retrying... (${attempt}/${MAX_ATTEMPTS})`);
      await new Promise((resolve) => setTimeout(resolve, DELAY)); // Delay before retry
    }
  }

  if (!verify) {
    console.warn("Transaction receipt not found after maximum attempts.");
  }

  return verify; // Returns the transaction status or null if not found
};
