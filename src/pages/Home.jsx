import { LuCopy } from "react-icons/lu";
import MintTable from "./MintTable";
import Blocks from "./Blocks";
import DepositAndWithdraw from "./DepositAndWithdraw";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setDataObject } from "../redux/slice"; 
// Action to clear the wallet data
import LogoImage from "../assets/Logo.png";
import { Link } from "react-router-dom";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const Home = () => {
  const dispatch = useDispatch();
  const stateData = useSelector((state) => state?.wallet?.dataObject);

  // Function to copy text
  const handleRegisterCopy = (copiedText) => {
    navigator.clipboard.writeText(`https://crowd1dev.netlify.app/referral/${copiedText}`);
    toast.success("Referral Link Copied");
  };

  const handleContractCopy = (copiedText) => {
    const contractLink = `https://poxscan.io/address-account/${copiedText}`;
    navigator.clipboard.writeText(contractLink);
    toast.success("Contract Link Copied");
  };

  // Function to handle sign out
  const handleSignOut = () => {
    dispatch(setDataObject()); // Clear wallet data using dispatch
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white ">
      <nav
        className="bg-[#151515] p-6 text-center mb-6 flex flex-row justify-between px-4 md:px-6 lg:px-6 xl:px-6 2xl:px-16 items-center"
        style={{
          boxShadow: `
          0 0px 25px rgba(0, 0, 0, 0.6)
        `,
        }}
      >
        <div>
          <img src={LogoImage} alt="crowd1-logo" className="w-[80%] md:w-full" />
        </div>

        <Link to="/">
          <div>
            <button
              className="whitespace-nowrap bg-[linear-gradient(to_right,#FFE27A,#FFBA57,#98DB7C,#8BCAFF)] text-black font-bold py-2 md:py-3 px-6 md:px-8 sm:px-6 rounded-lg
             shadow-lg hover:shadow-xl transition-all w-full md:w-full mt-4 md:mt-0"
              onClick={stateData?.walletAddress ? handleSignOut : null}
            >
              {stateData?.walletAddress ? "Sign out" : "Login"}
            </button>
          </div>
        </Link>
      </nav>

      <div className="px-4 2xl:px-16">
        {/* Referral Link and Contract Address */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 space-x-0 lg:space-x-10 mb-8">
          <div className="bg-[#151515] flex items-center justify-between space-x-8 p-6 rounded-2xl w-full lg:w-1/2">
            <p className="text-gray-400 font-medium truncate">
              Referral Link:{" "}
              {stateData?.walletAddress ? stateData?.walletAddress : ""}
            </p>
            <LuCopy
              color="white"
              size={24}
              className="cursor-pointer"
              onClick={() => handleRegisterCopy(stateData?.walletAddress)}
            />
          </div>

          <div className="bg-[#151515] flex items-center justify-between space-x-8 p-6 rounded-2xl w-full lg:w-1/2">
            <p className="text-gray-400 font-medium truncate">
              Contract Address: {CONTRACT_ADDRESS}
            </p>
            <LuCopy
              color="white"
              size={24}
              className="cursor-pointer"
              onClick={() => handleContractCopy(CONTRACT_ADDRESS)}
            />
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
