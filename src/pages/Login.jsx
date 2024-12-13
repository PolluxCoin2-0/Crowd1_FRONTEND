import { Link, useNavigate } from "react-router-dom";
import { getPolinkweb } from "../utils/connectWallet";
import { getUserIsSR, loginApi } from "../utils/api/apiFunctions";
import { useDispatch } from "react-redux";
import { setDataObject, setIsUserSR } from "../redux/slice";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "../components/Loader";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [srWalletAddress, setSrWalletAddress] = useState(null);
  const [normalWalletAddress, setNormalWalletAddress] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (isLoading) {
      toast.warning("Login in progress");
      return;
    }
    setIsLoading(true);

    const walletAddress = await getPolinkweb();
    if (walletAddress?.wallet_address) {
      try {
        let userWalletAddress = walletAddress?.wallet_address;
        setNormalWalletAddress(userWalletAddress);

        const userSRApiData = await getUserIsSR(userWalletAddress);
        if (userSRApiData?.message === "adderss undercontrol found") {
          setSrWalletAddress(userSRApiData?.data);
          setShowModal(true);
          setIsLoading(false);
          return;
        }

        await proceedWithLogin(userWalletAddress);
      } catch (error) {
        toast.error("Invalid wallet address or login failed.");
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const proceedWithLogin = async (walletAddress) => {
    try {
      const loginApiData = await loginApi(walletAddress);
      if (loginApiData?.statusCode !== 200) {
        throw new Error("Invalid wallet address or login failed.");
      }

      const updatedLoginData = {
        ...loginApiData?.data,
        walletAddress,
      };
      dispatch(setDataObject(updatedLoginData));
      toast.success("Login successful");
      navigate("/home");
    } catch (error) {
      toast.error("Invalid wallet address or login failed.");
      console.log("Login API Error:", error);
    }
  };

  const handleModalProceed = async () => {
    if (!selectedOption) {
      toast.warning("Please select an option to proceed.");
      return;
    }

    const selectedWallet =
      selectedOption === "option1" ? srWalletAddress : normalWalletAddress;

    if (selectedOption === "option1") {
      dispatch(setIsUserSR(true));
    }

    await proceedWithLogin(selectedWallet);
    setShowModal(false);
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

        {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Wallet</h3>
            <p className="mb-4">
              We detected multiple wallet options. Please select one to proceed:
            </p>
            <div className="flex flex-col space-y-3 text-left">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="walletOption"
                  value="option1"
                  className="mr-2"
                  onChange={() => setSelectedOption("option1")}
                />
                <span className="block sm:hidden text-left"><span className="font-semibold">Under Control Wallet:</span>
                  {`${srWalletAddress && srWalletAddress.slice(0, 6)}...${
                    srWalletAddress && srWalletAddress.slice(-6)
                  }`}
                </span>
                <span className="hidden sm:block"><span className="font-semibold">Under Control Wallet:</span> {srWalletAddress}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="walletOption"
                  value="option2"
                  className="mr-2"
                  onChange={() => setSelectedOption("option2")}
                />
                <span className="block sm:hidden"><span className="font-semibold">Active Wallet:</span>
                  {`${
                    normalWalletAddress && normalWalletAddress.slice(0, 6)
                  }...${normalWalletAddress && normalWalletAddress.slice(-6)}`}
                </span>
                <span className="hidden sm:block"><span className="font-semibold">Active Wallet:</span> {normalWalletAddress}</span>
              </label>
            </div>

            <button
              onClick={handleModalProceed}
              className="mt-4 w-full py-2 px-4 bg-[linear-gradient(to_right,#FFE27A,#FFBA57,#98DB7C,#8BCAFF)] text-black font-bold rounded-lg transition"
            >
              Proceed
            </button>
          </div>
        </div>
      )}

        <div className="space-y-2 sm:space-y-4">
          <p className="text-white text-xl sm:text-2xl font-bold">Crowd1.com</p>
          <p className="text-gray-300 text-lg sm:text-xl font-semibold">
            Welcome to Crowd1 Dashboard
          </p>
          <p className="text-gray-400 text-sm sm:text-base">
            To reach the dashboard, connect your wallet first!
          </p>
        </div>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <Link
            to="/register"
            className="border border-white text-white py-3 px-4 sm:px-6 font-bold rounded-full hover:bg-white hover:text-gray-900 transition-all w-full md:w-1/2"
          >
            Register
          </Link>
          <button
            className="whitespace-nowrap bg-[linear-gradient(to_right,#FFE27A,#FFBA57,#98DB7C,#8BCAFF)] text-black font-bold py-3 px-4 sm:px-6 rounded-full
             shadow-lg hover:shadow-xl transition-all w-full md:w-1/2"
            onClick={handleLogin}
          >
            {isLoading ? <Loader /> : " Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
