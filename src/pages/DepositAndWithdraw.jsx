import { useSelector } from "react-redux";
import POX from "../assets/PoxImg.png";
import { useEffect, useState } from "react";
import {
  depositFundApi,
  getDataOfDirectReferral,
  totalReferralReturnsApi,
  userDetailsApi,
  withdrawFundApi,
} from "../utils/api/apiFunctions";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const DepositAndWithdraw = ({ globalLoading, setGlobalLoading }) => {
  const stateData = useSelector((state) => state?.wallet?.dataObject);
  const [userTotallROIReturn, setUserTotallROIReturn] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [preCycleCount, setPreCycleCount] = useState(0);
  const [mintCount, setMintCount] = useState(0);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const [directReferralCount, setDirectReferralCount] = useState(0);

  const fetchData = async () => {
    const referralAmount = await totalReferralReturnsApi(
      stateData?.walletAddress
    );
    const userData = await userDetailsApi(stateData?.walletAddress);
    setUserTotallROIReturn(
      userData?.data?.previousDepositAmount +
        userData?.data?.previousReward +
        referralAmount?.data
    );
    setCycleCount(userData?.data?.cycleCount);
    setMintCount(userData?.data?.mintCount);
    setAvailableAmount(userData?.data?.depositAmount);
    setIsDeposit(userData?.data?.hasNewDeposit);
    setPreCycleCount(userData?.data?.preCycleCount);
    const directReferralData = await getDataOfDirectReferral(stateData?.token);
    setDirectReferralCount(directReferralData?.data?.leve1Count);
  };

  useEffect(() => {
    if (stateData?.walletAddress) {
      fetchData();
    }
  }, [stateData?.walletAddress, isLoading, globalLoading]);

  // DEPOSIT FUNCTION
  const handleDepositFunc = async () => {
    if (isLoading) {
      toast.warning("Deposit in progress...");
      return;
    }

    if (cycleCount % (30 + (cycleCount - 1) * 10) !== 0) {
      toast.error(
        `You can't deposit more than once every ${
          30 + (cycleCount - 1) * 10
        } days.`
      );
      return;
    }

    setIsLoading(true);

    // CHECK POX BALANCE IN USER WALLET
    const userBalance = await window.pox.getDetails();
    const poxBalance = userBalance[1]?.data?.Balance;
    if (poxBalance / Math.pow(10, 6) < 100) {
      toast.error("Insufficient POX balance.");
      setIsLoading(false);
      return;
    }

    try {
      const depositApiData = await depositFundApi(
        100,
        stateData?.referredBy,
        stateData?.walletAddress
      );

      const signedTransaction2 = await window.pox.signdata(
        depositApiData?.data?.transaction
      );

      const broadcast2 = await window.pox.broadcast(
        JSON.parse(signedTransaction2[1])
      );
      if (broadcast2[2] !== "Broadcast Successfully Done") {
        setIsLoading(false);
        toast.error("Failed to broadcast the transaction.");
        return;
      }

      await fetchData();
      setGlobalLoading(!globalLoading);
      toast.success("Deposited successfully.");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // WITHDRAW FUNCTION
  const handleWithDrawFunc = async () => {
    if (availableAmount == null || availableAmount <= 0) {
      toast.error("Insufficient funds.");
      return;
    }

    if (!isDeposit) {
      toast.error("First, make a new deposit.");
      return;
    }

    // direct referral checking
    if (preCycleCount === 1 && directReferralCount < 0) {
      toast.error("You shoudl have 1 direct referral");
      return;
    } else if (preCycleCount === 2 && directReferralCount < 2) {
      toast.error("You shoudl have 2 direct referral");
      return;
    } else if (preCycleCount === 3 && directReferralCount < 3) {
      toast.error("You shoudl have 3 direct referral");
      return;
    } else if (preCycleCount === 4 && directReferralCount < 4) {
      toast.error("You shoudl have 4 direct referral");
      return;
    } else if (preCycleCount === 5 && directReferralCount < 5) {
      toast.error("You shoudl have 5 direct referral");
      return;
    }

    if (withdrawLoading) {
      toast.warning("Withdrawal in progress...");
      setWithdrawLoading(false);
      return;
    }

    try {
      setWithdrawLoading(true);
      const withDrawApiData = await withdrawFundApi(stateData?.walletAddress);
      const signedTransaction = await window.pox.signdata(
        withDrawApiData?.data?.transaction
      );

      const broadcast = await window.pox.broadcast(
        JSON.parse(signedTransaction[1])
      );

      if (broadcast[2] !== "Broadcast Successfully Done") {
        setWithdrawLoading(false);
        toast.error("Failed to broadcast the transaction.");
        return;
      }

      await fetchData();
      setGlobalLoading(!globalLoading);
      toast.success("Withdrawn successfully.");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-10">
        {/* Deposit Section */}
        <div
          className="w-full lg:w-1/2 rounded-3xl"
          style={{
            boxShadow: `
      0 2px 20px rgba(0, 0, 0, 0.4), 
      inset 0 2px 5px rgba(255, 255, 255, 0.1),
      inset 0 0px 2px rgba(255, 255, 255, 0.1)
    `,
          }}
        >
          <p
            className="text-white font-bold text-xl text-center bg-[#1F1F21] rounded-t-3xl py-4 uppercase tracking-wider"
            style={{
              boxShadow: `
          0 2px 20px rgba(0, 0, 0, 0.4), 
          inset 0 2px 5px rgba(255, 255, 255, 0.1),
          inset 0 0px 2px rgba(255, 255, 255, 0.1)
        `,
            }}
          >
            Deposit
          </p>
          <div className="p-8">
            {/* <p className="text-left text-[#8C8B8B] font-semibold mt-2 tracking-wide">
              Min $20 - Max $1000
            </p> */}

            <div className=" flex flex-row justify-between items-center space-x-4">
              <p className="w-full px-4 py-3 text-white bg-[#151515] border border-[#3A3A3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9b9b] focus:border-transparent transition-all shadow-inner hover:shadow-lg placeholder-gray-500">
                100
              </p>
              <div className="flex flex-row items-center space-x-2 bg-[#151515] px-4 py-3 rounded-lg border border-[#3A3A3C]">
                <img src={POX} alt="USDX" className="w-6 h-6" />
                <p className="text-white font-medium pr-4">POX</p>
              </div>
            </div>

            <button
              onClick={handleDepositFunc}
              className="mt-8 w-full bg-[linear-gradient(to_right,#FFE27A,#FFBA57,#98DB7C,#8BCAFF)] text-black font-bold text-lg py-3 rounded-lg 
              shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              {isLoading ? <Loader /> : "Deposit"}
            </button>
          </div>
        </div>

        {/* Withdraw Section */}
        <div
          className="w-full lg:w-1/2 rounded-3xl"
          style={{
            boxShadow: `
      0 2px 20px rgba(0, 0, 0, 0.4), 
      inset 0 2px 5px rgba(255, 255, 255, 0.1),
      inset 0 0px 2px rgba(255, 255, 255, 0.1)
    `,
          }}
        >
          <p
            className="text-white font-bold text-xl text-center bg-[#1F1F21] rounded-t-3xl py-4 uppercase tracking-wider"
            style={{
              boxShadow: `
          0 2px 20px rgba(0, 0, 0, 0.4), 
          inset 0 2px 5px rgba(255, 255, 255, 0.1),
          inset 0 0px 2px rgba(255, 255, 255, 0.1)
        `,
            }}
          >
            WITHDRAW
          </p>
          <div className="p-8">
            {/* <p className="text-left text-[#8C8B8B] font-semibold mt-2 tracking-wide">
            Min $20 - Max $1000
            </p> */}

            <div className=" flex flex-row justify-between items-center space-x-4">
              <p className="w-full px-4 py-3 text-white bg-[#151515] border border-[#3A3A3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9b9b] focus:border-transparent transition-all shadow-inner hover:shadow-lg placeholder-gray-500">
                {userTotallROIReturn ? userTotallROIReturn : 0}
              </p>
              <div className="flex flex-row items-center space-x-2 bg-[#151515] px-4 py-3 rounded-lg border border-[#3A3A3C]">
                <img src={POX} alt="USDX" className="w-6 h-6" />
                <p className="text-white font-medium pr-4">POX</p>
              </div>
            </div>

            <button
              onClick={handleWithDrawFunc}
              className="mt-8 w-full bg-[linear-gradient(to_right,#FFE27A,#FFBA57,#98DB7C,#8BCAFF)] text-black font-bold text-lg py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              {withdrawLoading ? <Loader /> : "Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositAndWithdraw;
