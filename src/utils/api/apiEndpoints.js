const API_ENDPOINTS = {
  auth: {
    login: "/signIn",
    register: "/signUp",
  },
  user: {
    getUserDetails: "/getUser",
    depositFund: "/depositFund",
    withdrawFund: "/withdraw",
  },
  tokenReturns: {
    userTotalReturns: "/getUserTotalReturn",
    totalRoiReturns: "/getTotalRoiReturn",
    totalReferralReturns: "/getUserReferralRewards",
  },
  mint: {
    userMint:"/mint",
    getMintTime:"/getMintDate",
    updateMintTime:"/updateMintDate",
  },
};

export default API_ENDPOINTS;
