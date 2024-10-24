import { Link } from "react-router-dom";
import LogoImage from "../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDataObject } from "../redux/slice";
import { useEffect, useState } from "react";
import { getDataOfDirectReferral } from "../utils/api/apiFunctions";

const ReferralEarning = () => {
  const dispatch = useDispatch();
  const stateData = useSelector((state) => state?.wallet?.dataObject);
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [referralData, setReferralData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataOfDirectReferral(stateData?.token);
      console.log("direct referral", data?.data);
      setReferralData(data?.data);
    };
    fetchData();
  }, [stateData?.token]);

  const handleSignOut = () => {
    dispatch(setDataObject()); // Clear wallet data using dispatch
    toast.success("Signed out successfully");
  };

  const handleToggle = (level) => {
    // Toggle the selected level and close others
    setExpandedLevel((prev) => (prev === level ? null : level));
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
            
              <th className="py-4 px-6 text-right">Total Count</th>
            </tr>
          </thead>
          <tbody>
            {referralData && (
              <>
                <tr
                  onClick={() => handleToggle(1)}
                  className="cursor-pointer border-b border-gray-700 hover:bg-gray-800 transition-all"
                >
                  <td className="py-4 px-6">1</td>
                  <td className="py-4 px-6 text-right">{referralData?.leve1Count ? referralData?.leve1Count :0}</td>
                </tr>
                {expandedLevel === 1 && (
                  <tr>
                    <td colSpan="2">
                      <div className="bg-gray-800 p-4 shadow-md">
                        {referralData?.leve1Referrals?.length > 0 ? (
                          referralData.leve1Referrals.map((ref, index) => (
                            <div
                              key={index}
                              className="flex flex-col md:flex-row items-start md:justify-between md:items-center py-2 border-b border-gray-700 last:border-0"
                            >
                              <span>{ref.walletAddress}</span>
                              <span>{new Date(ref.createdAt).toLocaleString()}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No referrals</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                <tr
                  onClick={() => handleToggle(2)}
                  className="cursor-pointer border-b border-gray-700 hover:bg-gray-800 transition-all"
                >
                  <td className="py-4 px-6">2</td>
                  <td className="py-4 px-6 text-right">{referralData?.leve2Count ? referralData?.leve2Count : 0}</td>
                </tr>
                {expandedLevel === 2 && (
                  <tr>
                    <td colSpan="2">
                      <div className="bg-gray-800 p-4 shadow-md">
                        {referralData?.leve2Referrals?.length > 0 ? (
                          referralData.leve2Referrals.map((ref, index) => (
                            <div
                              key={index}
                              className="flex flex-col md:flex-row items-start md:justify-between md:items-center py-2 border-b border-gray-700 last:border-0"
                            >
                              <span>{ref.walletAddress}</span>
                              <span>{new Date(ref.createdAt).toLocaleString()}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No referrals</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                <tr
                  onClick={() => handleToggle(3)}
                  className="cursor-pointer border-b border-gray-700 hover:bg-gray-800 transition-all"
                >
                  <td className="py-4 px-6">3</td>
                  <td className="py-4 px-6 text-right">{referralData?.leve3Count ? referralData?.leve3Count : 0}</td>
                </tr>
                {expandedLevel === 3 && (
                  <tr>
                    <td colSpan="2">
                      <div className="bg-gray-800 p-4 shadow-md">
                        {referralData?.leve3Referrals?.length > 0 ? (
                          referralData.leve3Referrals.map((ref, index) => (
                            <div
                              key={index}
                              className="flex flex-col md:flex-row items-start md:justify-between md:items-center py-2 border-b border-gray-700 last:border-0"
                            >
                              <span>{ref.walletAddress}</span>
                              <span>{new Date(ref.createdAt).toLocaleString()}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No referrals</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

<tr
                  onClick={() => handleToggle(4)}
                  className="cursor-pointer border-b border-gray-700 hover:bg-gray-800 transition-all"
                >
                  <td className="py-4 px-6">4</td>
                  <td className="py-4 px-6 text-right">{referralData?.leve4Count ? referralData?.leve4Count : 0}</td>
                </tr>

{expandedLevel === 4 && (
                  <tr>
                    <td colSpan="2">
                      <div className="bg-gray-800 p-4 shadow-md">
                        {referralData?.leve4Referrals?.length > 0 ? (
                          referralData.leve4Referrals.map((ref, index) => (
                            <div
                              key={index}
                              className="flex flex-col md:flex-row items-start md:justify-between md:items-center py-2 border-b border-gray-700 last:border-0"
                            >
                              <span>{ref.walletAddress}</span>
                              <span>{new Date(ref.createdAt).toLocaleString()}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No referrals</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                  <tr
                  onClick={() => handleToggle(5)}
                  className="cursor-pointer border-b border-gray-700 hover:bg-gray-800 transition-all"
                >
                  <td className="py-4 px-6">5</td>
                  <td className="py-4 px-6 text-right">{referralData?.leve5Count ? referralData?.leve5Count : 0}</td>
                </tr>
{expandedLevel === 5 && (
                  <tr>
                    <td colSpan="2">
                      <div className="bg-gray-800 p-4 shadow-md">
                        {referralData?.leve5Referrals?.length > 0 ? (
                          referralData.leve5Referrals.map((ref, index) => (
                            <div
                              key={index}
                              className="flex flex-col md:flex-row items-start md:justify-between md:items-center py-2 border-b border-gray-700 last:border-0"
                            >
                              <span>{ref.walletAddress}</span>
                              <span>{new Date(ref.createdAt).toLocaleString()}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No referrals</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralEarning;
