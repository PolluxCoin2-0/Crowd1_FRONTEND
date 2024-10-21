import { Link, useNavigate } from "react-router-dom";
import { getPolinkweb } from "../utils/connectWallet";
import { loginApi } from "../utils/api/apiFunctions";
import { useDispatch } from "react-redux";
import { setDataObject } from "../redux/slice";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async()=>{
    const walletAddress = await getPolinkweb();
    if(walletAddress){
      try {
        const apiData = await loginApi(walletAddress);
      if(apiData?.data?.walletAddress){
        //save apiResponse object in state management redux
        dispatch(setDataObject(apiData?.data));
        navigate("/home");
      }
      } catch (error) {
        toast.error("Wallet address is not registered!")
        return;
      }
    }
  }
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="border border-[#39393C] p-6 sm:p-8 rounded-2xl text-center space-y-8 max-w-sm sm:max-w-md w-full bg-[#000000]"
         style={{
            boxShadow: `
              0 0px 5px rgba(255, 255, 255, 0.3)
            `,
          }}
        >
          <div className="space-y-2 sm:space-y-4">
            <p className="text-white text-xl sm:text-2xl font-bold">Crowd1.com</p>
            <p className="text-gray-300 text-lg sm:text-xl font-semibold">Welcome to Crowd1 Dashboard</p>
            <p className="text-gray-400 text-sm sm:text-base">To reach the dashboard, connect your wallet first!</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <Link to="/register" className="border border-white text-white py-3 px-4 sm:px-6 font-bold rounded-full hover:bg-white hover:text-gray-900 transition-all w-full md:w-1/2">
              Register
            </Link>
            <button className="whitespace-nowrap bg-[linear-gradient(to_right,#FFE27A,#FFBA57,#98DB7C,#8BCAFF)] text-black font-bold py-3 px-4 sm:px-6 rounded-full
             shadow-lg hover:shadow-xl transition-all w-full md:w-1/2"
             onClick={handleLogin}
             >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;
  