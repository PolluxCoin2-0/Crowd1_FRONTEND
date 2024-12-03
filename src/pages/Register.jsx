import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { depositFundApi, mainnetBalanceApi, registerApi } from "../utils/api/apiFunctions";
import { getPolinkweb } from "../utils/connectWallet";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDataObject } from "../redux/slice";
import Loader from "../components/Loader";
import { SignBroadcastTransactionStatus } from "../utils/signBroadcastTransaction";

const Register = () => {
  const [referralWallet, setReferralWallet] = useState("");
  const [myWallet, setMyWallet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [poxBalance, setPoxBalance] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const referralAddress = location.state?.referralAddress;

  useEffect(() => {
    if (referralAddress) {
      setReferralWallet(referralAddress);
      toast.info("Referral Code Applied Successfully");
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (isLoading) {
      toast.warning("Registration in progress");
      return;
    }

    // Basic validation
    if (!myWallet || !referralWallet) {
      toast.error("Enter both addresses.");
      return;
    }

    try {
      setIsLoading(true);
      // Deposit Function
      const depositSuccess =  await handleDepositFunc();
      if (!depositSuccess || depositSuccess === "REVERT") {
        // Stop registration if deposit fails
        toast.error("Deposit failed or insufficient balance.");
        setIsLoading(false);
        return;
      }
      
      const response = await registerApi(myWallet, referralWallet);
      // Handle successful response
      if (response.data === "Duplicate Wallet") {
        toast.error("Duplicate Wallet.");
      } else if (response.data.walletAddress) {
        dispatch(setDataObject(response?.data));
        setReferralWallet("");
        setMyWallet("");
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepositFunc = async () => {
    // CHECK POX BALANCE IN USER WALLET
    const balanceMainnetFromApi = await mainnetBalanceApi(myWallet)

    if (balanceMainnetFromApi?.balance / Math.pow(10, 6) < 100) {
      toast.error("Insufficient POX balance.");
      setIsLoading(false);
      return null;
    }

    try {
      const depositApiData = await depositFundApi(100,referralWallet, myWallet);

      console.log({depositApiData})

        // SIGN, BROADCAST and TRANSACTION STATUS
        const signBroadcastTransactionStatusFuncRes = await SignBroadcastTransactionStatus(depositApiData?.data?.transaction)

        if (signBroadcastTransactionStatusFuncRes.transactionStatus !== "SUCCESS") {
          toast.error("Transaction failed!");
          setIsLoading(false);
          return "REVERT";
        }

      return signBroadcastTransactionStatusFuncRes?.transactionStatus;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong during the deposit process.");
    return null; 
    }
  };

  const handleWalletAddress = async () => {
    if (walletLoading) {
      toast.warning("Fetching wallet address...");
      return;
    }

    setWalletLoading(true);
    try {
      const walletAddress = await getPolinkweb();
      if (walletAddress?.wallet_address) {
        setMyWallet(walletAddress?.wallet_address);
        setPoxBalance(walletAddress?.Balance);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div
        className="border border-[#39393C] p-6 sm:p-8 rounded-2xl text-center space-y-8 max-w-sm sm:max-w-md w-full bg-[#000000]"
        style={{
          boxShadow: `
              0 0px 5px rgba(255, 255, 255, 0.3)
            `,
        }}
      >
        <div className="space-y-2 sm:space-y-2">
          <p className="text-white text-xl sm:text-2xl font-bold">Crowd1.com</p>
          <p className="text-gray-300 text-lg sm:text-xl font-semibold">
            Register to Crowd1 Dashboard
          </p>
          <p className="text-gray-400 text-sm sm:text-base">
            To reach the dashboard, connect your wallet first!
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="My Wallet address"
            value={myWallet}
            onClick={!myWallet && handleWalletAddress}
            // onChange={(e) => setMyWallet(e.target.value)}
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-[#1F1F21] via-[#242426] to-[#1F1F21] border border-transparent rounded-full 
              focus:outline-none focus:ring-1 focus:ring-[#9b9b9b] focus:border-transparent transition-all shadow-inner hover:shadow-lg placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Referral Wallet address"
            value={referralWallet}
            onChange={(e) => setReferralWallet(e.target.value)}
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-[#1F1F21] via-[#242426] to-[#1F1F21] border border-transparent rounded-full 
              focus:outline-none focus:ring-1 focus:ring-[#9b9b9b] focus:border-transparent transition-all shadow-inner hover:shadow-lg placeholder-gray-500"
          />

          <button
            onClick={handleRegister}
            type="submit"
            className="whitespace-nowrap bg-[linear-gradient(to_right,#FFE27A,#FFBA57,#98DB7C,#8BCAFF)] text-black font-bold py-3 px-4 sm:px-6 
            rounded-full shadow-lg hover:shadow-xl transition-all w-full"
          >
            {isLoading ? <Loader /> : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
