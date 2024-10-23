import { Link } from "react-router-dom";
import LogoImage from "../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDataObject } from "../redux/slice";
import { useEffect } from "react";
import { getDataOfDirectReferral } from "../utils/api/apiFunctions";

const ReferralEarning = () => {
  const dispatch = useDispatch();
  const stateData = useSelector((state) => state?.wallet?.dataObject);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataOfDirectReferral(stateData?.token);
      console.log("direct referral", data?.data);
    };
    fetchData();
  }, []);

  const dummyData = [
    {
      level: "1",
      totalWallets: "50",
      totalInvestments: "$10,000",
      totalEarnings: "$1,500",
    },
    {
      level: "2",
      totalWallets: "30",
      totalInvestments: "$6,000",
      totalEarnings: "$900",
    },
    {
      level: "3",
      totalWallets: "20",
      totalInvestments: "$4,000",
      totalEarnings: "$600",
    },
  ];

  const handleSignOut = () => {
    dispatch(setDataObject()); // Clear wallet data using dispatch
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white ">
      {/* Navbar */}
      <nav
        className="bg-[#151515] p-6 text-center mb-6 flex flex-row justify-between px-4 md:px-6 lg:px-6 xl:px-6 2xl:px-16 items-center"
        style={{
          boxShadow: `
          0 0px 25px rgba(0, 0, 0, 0.6)
        `,
        }}
      >
        <Link to="/home">
          <img
            src={LogoImage}
            alt="crowd1-logo"
            className="w-[80%] md:w-full"
          />
        </Link>

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

      {/* Table Section */}
      <div className="overflow-x-auto py-6 px-4 2xl:px-32">
        <table className="min-w-full  text-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="text-left text-sm uppercase border-b border-gray-700">
              <th className="py-4 px-6">Level</th>
              <th className="py-4 px-6 text-center">Total Wallets</th>
              <th className="py-4 px-6 text-center">Total Investments</th>
              <th className="py-4 px-6 text-right">Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((data, index) => (
              <tr
                key={index}
                className={`border-b border-gray-700 hover:bg-gray-800 transition-all ${
                  index === dummyData.length - 1 ? "last:border-0" : ""
                }`}
              >
                <td className="py-4 px-6">{data.level}</td>
                <td className="py-4 px-6 text-center">{data.totalWallets}</td>
                <td className="py-4 px-6 text-center">
                  {data.totalInvestments}
                </td>
                <td className="py-4 px-6 text-right">{data.totalEarnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralEarning;
