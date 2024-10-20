import { useEffect, useState } from "react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { RiExchangeDollarLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { totalReferralReturnsApi, userTotalReturnsApi } from "../utils/api/apiFunctions";
import { useSelector } from "react-redux";

const Blocks = () => {
  const [userCrowd1Balance, setCrowd1Balance] = useState(0);
  const [userReferralBalance, setUserReferralBalance] = useState(0);
  const stateData = useSelector((state)=>state?.wallet?.dataObject)

  useEffect(()=>{
    const fetchData = async()=>{
     // User Crowd1 Balance
     const crowd1BalanceData = await userTotalReturnsApi(stateData?.walletAddress);
     setCrowd1Balance(crowd1BalanceData?.data);
    //  User Total Referral Earnings
    const referralBalance = await totalReferralReturnsApi(stateData?.walletAddress);
    setUserReferralBalance(referralBalance?.data);
    }
    fetchData();
  }, [])

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 space-x-0 lg:space-x-10 mb-8">
        {/* Crowd1 Balance */}
        <div
          className="bg-[#141414] shadow-xl rounded-3xl w-full md:w-full lg:w-[33%] flex flex-row justify-between items-center px-4 py-8 md:px-5"
          style={{
            boxShadow: `
                0 2px 20px rgba(0, 0, 0, 0.4), 
                inset 0 0 10px rgba(255, 255, 255, 0.1)
              `, // White shadow with moderate opacity
          }}
        >
          <div>
            <p className="text-md md:text-2xl lg:text-xl xl:text-4xl text-white font-bold pb-2 md:pb-0">
              $ {userCrowd1Balance}
            </p>
            <p className="text-[#8C8B8B] text-xs md:text-lg font-semibold mt-0 md:mt-3 text-nowrap">
              Your crowd1 Balance
            </p>
          </div>
          <div className="bg-[#202020] rounded-full p-[8px]">
            <MdOutlineAccountBalanceWallet size={28} color="white" />
          </div>
        </div>

        {/* Referral Earnings */}
        <div
          className="bg-[#141414] shadow-xl rounded-3xl w-full md:w-full lg:w-[33%] flex flex-row justify-between items-center px-4 py-8 md:px-5"
          style={{
            boxShadow: `
                0 2px 20px rgba(0, 0, 0, 0.4), 
                inset 0 0 10px rgba(255, 255, 255, 0.1)
              `, // White shadow with moderate opacity
          }}
        >
          <div>
            <p className="text-md md:text-2xl lg:text-xl xl:text-4xl text-white font-bold pb-2 md:pb-0">
              $ {userReferralBalance}
            </p>
            <p className="text-[#8C8B8B] text-xs md:text-lg font-semibold mt-0 md:mt-3 text-nowrap">
              Your Referral Earnings
            </p>
          </div>
          <div className="bg-[#202020] rounded-full p-[8px]">
            <RiExchangeDollarLine size={28} color="white" />
          </div>
        </div>

        {/* Referral Wallets */}
        <div
          className="bg-[#141414] shadow-xl rounded-3xl w-full md:w-full lg:w-[33%] flex flex-row justify-between items-center px-4 py-8 md:px-5"
          style={{
            boxShadow: `
                0 2px 20px rgba(0, 0, 0, 0.4), 
                inset 0 0 10px rgba(255, 255, 255, 0.1)
              `, // White shadow with moderate opacity
          }}
        >
          <div>
            <p className="text-md md:text-2xl lg:text-xl xl:text-4xl text-white font-bold pb-2 md:pb-0">
              100
            </p>
            <p className="text-[#8C8B8B] text-xs md:text-lg font-semibold mt-0 md:mt-3 text-nowrap">
              Your Referral Wallets
            </p>
          </div>
          {/* <Link to="/referralearning"> */}
            <div className="bg-[#202020] cursor-pointer rounded-full p-[8px]">
              <p className="text-sm p-1 text-[#8C8B8B] font-semibold">View</p>
            </div>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Blocks;
