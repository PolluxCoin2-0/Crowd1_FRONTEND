import { useSelector } from "react-redux";
import POX from "../assets/PoxImg.png";
import { useEffect, useState } from "react";
import {
  depositFundApi,
  totalRoiReturnsApi,
  userDetailsApi,
  withdrawFundApi,
} from "../utils/api/apiFunctions";
import { toast } from "react-toastify";

const DepositAndWithdraw = () => {
  const stateData = useSelector((state) => state?.wallet?.dataObject);
  const [userTotallROIReturn, setUserTotallROIReturn] = useState(0);
  const [availableAmount, setAvailableAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const userROIReturnData = await totalRoiReturnsApi(
        stateData?.walletAddress
      );
      setUserTotallROIReturn(userROIReturnData?.data);
      const userData = await userDetailsApi(stateData?.walletAddress);
      setAvailableAmount( userData?.data?.depositAmount)
    };
    if(stateData?.walletAddress){
      fetchData();
    }
  }, [stateData?.walletAddress]);

  const handleDepositFunc = async () => {
    const depositApiData = await depositFundApi(
      100,
      stateData?.referredBy,
      stateData?.walletAddress
    );
    console.log("depositdata", depositApiData?.data?.transaction);

    const signedTransaction2 = await window.pox.signdata(
      depositApiData?.data?.transaction
    );

    console.log("signedTransaction: ", signedTransaction2);

    const broadcast2 = JSON.stringify(
      await window.pox.broadcast(JSON.parse(signedTransaction2[1]))
    );

    console.log("broadcast", broadcast2);
    toast.success("Deposited successfully.");
  };

  const handleWithDrawFunc = async () => {
    if (availableAmount == null ||availableAmount <= 0) {
      toast.error("Insufficient funds.");
      return;
    }

    const withDrawApiData = await withdrawFundApi(stateData?.walletAddress);
    console.log(withDrawApiData);
    const signedTransaction = await window.pox.signdata(
      withDrawApiData?.data?.transaction
    );

    console.log("signedTransaction: ", signedTransaction);

    const broadcast = JSON.stringify(
      await window.pox.broadcast(JSON.parse(signedTransaction[1]))
    );

    console.log("broadcast", broadcast);
    toast.success("Withdrawn successfully.");
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
              Deposit
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
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositAndWithdraw;
