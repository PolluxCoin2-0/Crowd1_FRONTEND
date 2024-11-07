import axios from "axios";

const MAX_ATTEMPTS = 5;
const DELAY = 3000;

/**
 * Function to verify a transaction by ID, with retries and delay.
 *
 * @param {string} txID - The transaction ID to verify.
 *
 * @returns {Promise<object|null>} - The receipt data if verification is successful, otherwise null.
 */
export const verifyTransactionById = async (txID) => {
  let attempt = 0;
  let verify = null;

  while (attempt < MAX_ATTEMPTS) {
    try {
      const response = await axios.post(
        "https://testnet-fullnode.poxscan.io/wallet/gettransactioninfobyid",
        { value: txID }
      );

      console.log(`Attempt ${attempt + 1}:`, response?.data);

      if (response?.data?.receipt) {
        console.log("Transaction receipt found:", response?.data?.receipt);
        verify = response?.data?.receipt?.result;
        break; // Exit loop if receipt is found
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
    }

    attempt++;
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, DELAY)); // Delay for 3 seconds
    }
  }

  return verify;
};
