import axios from "axios";
import API_ENDPOINTS from "./apiEndpoints"; // Import the API endpoints

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Generic POST request handler
 * @param {string} endpoint - The API endpoint to call (without base URL).
 * @param {object} data - Data to send in the POST request.
 * @returns {Promise<object>} - The response data from the API.
 */
const postRequest = async (endpoint, data) => {
  console.log(BASE_URL+endpoint, data);
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data);
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
const getRequest = async (endpoint, token) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error in GET ${endpoint}:`,
      error.response || error.message
    );
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
    const response = await axios.put(`${BASE_URL}${endpoint}`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
  console.log(walletAddress)
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

// APPROVE DEPOSIT
export const approveApi = async (walletAddress, amount) => {
  console.log(walletAddress, amount);
  return postRequest(API_ENDPOINTS.approve, { walletAddress, amount });
};
