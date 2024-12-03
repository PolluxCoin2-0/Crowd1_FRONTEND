import axios from "axios";
import API_ENDPOINTS from "./apiEndpoints"; // Import the API endpoints

const BASE_URL = import.meta.env.VITE_BASE_URL;
const FULL_NODE_TRANSACTION_URL = import.meta.env.VITE_FULL_NODE_TRANSACTION_URL || "";

/**
 * Generic POST request handler with token authentication
 * @param {string} endpoint - The API endpoint to call (without base URL).
 * @param {object} data - Data to send in the POST request.
 * @param {string} token - The authentication token to be included in headers.
 * @returns {Promise<object>} - The response data from the API.
 */
const postRequest = async (endpoint, data, token) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        "Content-Type": "application/json", // Optional: Set content type to JSON
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error in POST ${endpoint}:`,
      error.response || error.message
    );
    throw error;
  }
};

/**
 * Generic GET request handler with token authentication
 * @param {string} endpoint - The API endpoint to call (without base URL).
 * @param {string} token - The authorization token to send in the headers.
 * @param {object} [params] - Query parameters to send in the GET request.
 * @returns {Promise<object>} - The response data from the API.
 */
const getRequest = async (endpoint, token, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params, // Add query parameters here
    });
    return response.data;
  } catch (error) {
    console.error(`Error in GET ${endpoint}:`, error.response || error.message);
    throw error;
  }
};

/**
 * Generic PUT request handler
 * @param {string} endpoint - The API endpoint to call (without base URL).
 * @param {object} data - Data to send in the PUT request.
 * @returns {Promise<object>} - The response data from the API.
 */
const putRequest = async (endpoint, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${endpoint}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error in PUT ${endpoint}:`, error.response || error.message);
    throw error;
  }
};

// LOGIN
export const loginApi = async (walletAddress) => {
  return postRequest(API_ENDPOINTS.auth.login, { walletAddress });
};

// REGISTER
export const registerApi = async (walletAddress, referralAddress) => {
  return postRequest(API_ENDPOINTS.auth.register, {
    walletAddress,
    referredBy: referralAddress,
  });
};

// GET USER DETAILS
export const userDetailsApi = async (walletAddress) => {
  return postRequest(API_ENDPOINTS.user.getUserDetails, { walletAddress });
};

// DEPOSIT FUND
export const depositFundApi = async (
  amount,
  referralAddress,
  walletAddress
) => {
  return postRequest(API_ENDPOINTS.user.depositFund, {
    amount,
    referrer: referralAddress,
    walletAddress,
  });
};

// WITHDRAW FUND
export const withdrawFundApi = async (walletAddress) => {
  return postRequest(API_ENDPOINTS.user.withdrawFund, { walletAddress });
};

// MINT
export const mintApi = async (walletAddress) => {
  return postRequest(API_ENDPOINTS.mint.userMint, { walletAddress });
};

// GET USER MINT TIME
export const getUserMintedTimeApi = async (token) => {
  return getRequest(API_ENDPOINTS.mint.getMintTime, token);
};

// UPDATE USER MINT TIME
export const updateUserMintedTimeApi = async (token) => {
  return putRequest(API_ENDPOINTS.mint.updateMintTime, token);
};

// GET USER TOTAL RETURNS
export const userTotalReturnsApi = async (walletAddress) => {
  return postRequest(API_ENDPOINTS.tokenReturns.userTotalReturns, {
    walletAddress,
  });
};

// GET TOTAL ROI RETURNS
export const totalRoiReturnsApi = async (walletAddress) => {
  return postRequest(API_ENDPOINTS.tokenReturns.totalRoiReturns, {
    walletAddress,
  });
};

// GET TOTAL REFERRAL RETURNS
export const totalReferralReturnsApi = async (walletAddress) => {
  return postRequest(API_ENDPOINTS.tokenReturns.totalReferralReturns, {
    walletAddress,
  });
};

// SAVE DATA TO DB
export const saveDataToDBApi = async (
  cycleNo,
  amount,
  interest,
  totalEarning,
  investmentDate,
  maturityDays,
  token
) => {
  return postRequest(
    API_ENDPOINTS.DB.saveToDB,
    {
      cycleNo: cycleNo,
      amount: amount,
      interest: interest,
      totalEarning: totalEarning,
      investmentDate: investmentDate,
      maturityDays: maturityDays,
    },
    token
  );
};

// GET DATA FROM DB
export const getDataFromDBApi = async (token) => {
  return getRequest(API_ENDPOINTS.DB.getFromDB, token);
};

// GET DIRECT REFERRALS
export const getDataOfDirectReferral = async (token) => {
  return getRequest(API_ENDPOINTS.referral.directReferral, token, {
    search: "",
  });
};

// LAST MINT TIME
export const getLastMintedTimeApi = async (walletAddress) => {
  return postRequest(API_ENDPOINTS.mint.lastMintTime, {
    walletAddress,
  });
};

// Broadcast API
export const broadcastApi = async (transaction) => {
  try {
    const broadcastResponse = await axios.post(
      `${FULL_NODE_TRANSACTION_URL}/wallet/broadcasttransaction`,
      transaction
    );

    return broadcastResponse?.data
  } catch (error) {
    console.error("Error broadcasting transaction:", error);
    throw new Error("Failed to broadcast transaction.");
  }
};
