import { LuCopy } from "react-icons/lu";
import MintTable from "./MintTable";
import Blocks from "./Blocks";
import DepositAndWithdraw from "./DepositAndWithdraw";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LogoImage from "../assets/Logo.png";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const Home = () => {
  const stateData = useSelector((state)=>state?.wallet?.dataObject)

  const handleCopy = (copiedText) => {
    navigator.clipboard.writeText(copiedText);
    toast.success("Address copied");
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white ">
      <nav
        className="bg-[#151515] p-6 text-center mb-6 flex justify-center"
        style={{
          boxShadow: `
              0 0px 25px rgba(0, 0, 0, 0.6)
            `,
        }}
      >
        <img src={LogoImage} alt="crowd1-logo"/>
      </nav>
      <div className="px-4 2xl:px-16">
        {/* Referral Link and Contract Address */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 space-x-0 lg:space-x-10 mb-8">
          <div className="bg-[#151515] flex items-center justify-between space-x-8 p-6 rounded-2xl w-full lg:w-1/2">
            <p className="text-gray-400 font-medium truncate">
              Referral Link: {stateData?.walletAddress ? stateData?.walletAddress : ""}
            </p>
            <LuCopy color="white" size={24} className="cursor-pointer" onClick={()=>handleCopy("PR4fchA4kPy2m7HWuSiEcFz714cAnQcME9")}/>
          </div>

          <div className="bg-[#151515] flex items-center justify-between space-x-8 p-6 rounded-2xl w-full lg:w-1/2">
            <p className="text-gray-400 font-medium truncate">
              Contract Address: {CONTRACT_ADDRESS}
            </p>
            <LuCopy color="white" size={24} className="cursor-pointer" onClick={()=>handleCopy("PR4fchA4kPy2m7HWuSiEcFz714cAnQcME9")}/>
          </div>
        </div>

        {/* Blocks */}
        <Blocks />

        {/* Deposit and Withdraw */}
        <DepositAndWithdraw />

        {/* Table */}
        <MintTable />
      </div>
    </div>
  );
};

export default Home;
