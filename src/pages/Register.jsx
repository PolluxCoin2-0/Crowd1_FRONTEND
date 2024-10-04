import { useState } from "react";
import { toast } from "react-toastify";
import { registerApi } from "../utils/api/apiFunctions";
import { getPolinkweb } from "../utils/connectWallet";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDataObject } from "../redux/slice";

  const Register = () => {
    const [referralWallet, setReferralWallet] = useState("");
    const [myWallet, setMyWallet] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRegister = async (e) => {
      e.preventDefault(); // Prevent the default form submission
  
      // Basic validation
      if (!myWallet || !referralWallet) {
        toast.error("Enter both addresses.");
        return;
      }
  
      try {
        const response = await registerApi(myWallet, referralWallet);
        console.log(response);
        // Handle successful response
        if(response.data === "Duplicate Wallet")
          {
            toast.error("Duplicate Wallet.");
          }
          else if (response.data.walletAddress) {
          toast.success("Registration successful!");
          // Optionally reset the form
          setReferralWallet("");
          setMyWallet("");
          dispatch(setDataObject(response?.data));
          navigate("/");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("An error occurred during registration.");
      }
    };

    const handleWalletAddress =async()=>{
      const walletAddress = await getPolinkweb();
      if(walletAddress){
        setMyWallet(walletAddress);
      }
    }


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
            <p className="text-gray-300 text-lg sm:text-xl font-semibold">Register to Crowd1 Dashboard</p>
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
             Register
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default Register;
