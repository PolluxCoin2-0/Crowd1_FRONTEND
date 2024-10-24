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
  DB:{
    saveToDB : "/createCycle",
    getFromDB : "/getAllCycles"
  },
  referral :{
    directReferral : "/getAllReferrals"
  }
};

export default API_ENDPOINTS;
