import { useSelector } from "react-redux";
import {
  getDataFromDBApi,
  getLastMintedTimeApi,
  getUserMintedTimeApi,
  mintApi,
  saveDataToDBApi,
  updateUserMintedTimeApi,
  userDetailsApi,
} from "../utils/api/apiFunctions";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const MintTable = ({ globalLoading, setGlobalLoading }) => {
  const stateData = useSelector((state) => state?.wallet?.dataObject);
  const [userDataApi, setUserDataApi] = useState({});
  const [previousDataArray, setPreviousDataArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMintedTimeForTable, setLastMintedTimeForTable] = useState("");

  const fetchData = async () => {
    const userDataApi = await userDetailsApi(stateData?.walletAddress);
    console.log({ userDataApi})
    setUserDataApi(userDataApi?.data); // Set user data to state variable
    // GET THE DATA FROM DB
    const userDataFromDB = await getDataFromDBApi(stateData?.token);
    setPreviousDataArray(userDataFromDB?.data);
    const lastMintedData = await getLastMintedTimeApi(stateData?.walletAddress);
    const lastMintedDateUTC = lastMintedData?.lastMintedAt;
    console.log({ lastMintedDateUTC });
    
    if (lastMintedDateUTC === "01/01/1970, 05:30:00") {
        // If the value is the Unix epoch start in IST, set "First Minting"
        setLastMintedTimeForTable("First Minting");
    } else if (lastMintedDateUTC) {
      setLastMintedTimeForTable(lastMintedDateUTC);
    } else {
        setLastMintedTimeForTable("No date available");
    }
  };

  useEffect(() => {
    if (stateData?.walletAddress) {
      fetchData();
    }
  }, [isLoading, globalLoading]);

  const getFormattedDate = () => {
    const now = new Date();

    // Get the offset in minutes and convert it to hours and minutes
    const offset = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, "0");
    const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
    const offsetSign = offset >= 0 ? "+" : "-";

    // Format the date as YYYY-MM-DDTHH:mm:ss
    const formattedDate = now.toISOString().replace(/\.\d{3}Z$/, "");

    // Append the timezone offset
    return `${formattedDate}${offsetSign}${offsetHours}:${offsetMinutes}`;
  };

  const handldeMintFunc = async () => {
    if (userDataApi?.depositAmount == null || userDataApi.depositAmount <= 0) {
      toast.error("Deposit amount must be greater than 0.");
      return;
    }

    if (isLoading) {
      toast.warning("Minting in progress!");
      return;
    }

    try {
      setIsLoading(true);
      if (userDataApi?.previousDepositAmount > 0) {
        toast.error("Please withdraw the amount first.");
        setIsLoading(false);
        return;
    } 
      const lastMintTime = await getUserMintedTimeApi(stateData?.token);
      const currentTime = new Date(); // Get current time

      // Check if lastMintTime?.data is a valid date
      const isValidDate = (date) => {
        return !isNaN(new Date(date).getTime()); // Returns true if valid date, false otherwise
      };

      let lastMintDate = null;

      if (lastMintTime?.data && isValidDate(lastMintTime.data)) {
        lastMintDate = new Date(lastMintTime.data); // Convert last mint date to 'YYYY-MM-DD'
      }

      // Check if 24 hours have passed since lastMintTime
      if (lastMintDate) {
        const timeDifference = currentTime - lastMintDate; // Difference in milliseconds
        const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert difference to hours

        if (hoursDifference < 24) {
          toast.error("You can't mint more than once per 24 hours.");
          return;
        }
      }
      const mintApiData = await mintApi(stateData?.walletAddress);

      console.log({mintApiData})

      const signedTransaction = await window.pox.signdata(
        mintApiData?.data?.transaction
      );

      console.log({signedTransaction})

      const broadcast = await window.pox.broadcast(
        JSON.parse(signedTransaction[1])
      );

      console.log({broadcast})

      if (broadcast[2] !== "Broadcast Successfully Done") {
        setIsLoading(false);
        toast.error("Failed to broadcast the transaction.");
        return;
      }

      // update user mint time
      await updateUserMintedTimeApi(stateData?.token);

      // Calculate the threshold based on cycleCount
      const mintThreshold = 30 + (userDataApi?.cycleCount - 1) * 10;
      if (userDataApi?.mintCount === mintThreshold - 1) {
        // SAVE TO DB
        const time = getFormattedDate();
        try {
          await saveDataToDBApi(
            userDataApi?.cycleCount,
            userDataApi?.depositAmount,
            30,
            30,
            time,
            mintThreshold,
            stateData?.token
          );
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong DB");
        }
      }
      await fetchData();
      setGlobalLoading(!globalLoading);
      toast.success("Minted successfully.");
    } catch (error) {
      toast.error("Something went wrong mint");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent text-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="text-left text-sm uppercase border-b-2 border-[#313133]">
              <th className="py-4 px-6">Cycle</th>
              <th className="py-4 px-6 text-center">Amount</th>
              <th className="py-4 px-6 text-center">Interest 30%</th>
              <th className="py-4 px-6 text-center">Total Earnings</th>
              <th className="py-4 px-6 text-center">Invest Date</th>
              <th className="py-4 px-6 text-center">Maturity Days</th>
              <th className="py-4 px-6 text-center">Last Minted</th>
              <th className="py-4 px-6 text-right">Mint Reward</th>
            </tr>
          </thead>
          <tbody>
            {/* border-b border-[#313133] */}
            {previousDataArray.length > 0 &&
              previousDataArray.map((data) => {
                return (
                  <>
                    <tr
                      className="border-none hover:bg-[#2C2C2E] transition-all bg-transparent"
                      key={data?._id}
                    >
                      <td className="py-4 px-6">{data?.cycleNo}</td>
                      <td className="py-4 px-6 text-center">{data?.amount}</td>
                      <td className="py-4 px-6 text-center">
                        {Number(data?.amount * 0.3).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {data?.totalEarning}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {new Date(data?.investmentDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {" "}
                        {`${30 + (data?.cycleNo - 1) * 10}/${
                          30 + (data?.cycleNo - 1) * 10
                        }`}
                      </td>
                      <td className="py-4 px-6 text-center">Completed</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          className="bg-[linear-gradient(to_right,rgba(255,226,122,0.5),rgba(255,186,87,0.5),rgba(152,219,124,0.5),rgba(139,202,255,0.5))]
                   text-black font-bold py-2 px-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-not-allowed"
                        >
                          Minted
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
          {userDataApi?.cycleCount &&
          userDataApi?.cycleCount !==
            previousDataArray[previousDataArray?.length - 1]?.cycleNo ? (
            <>
              <tbody>
                <tr className="border-none hover:bg-[#2C2C2E] transition-all bg-transparent">
                  <td className="py-4 px-6">
                    {userDataApi?.cycleCount ? userDataApi?.cycleCount : 0}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {userDataApi?.depositAmount
                      ? userDataApi?.depositAmount
                      : 0}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {userDataApi?.depositAmount
                      ? (userDataApi.depositAmount * 0.3).toFixed(2)
                      : 0}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {userDataApi?.totalReward ? userDataApi?.totalReward : 0}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {userDataApi?.startTime
                      ? new Date(
                          userDataApi.startTime * 1000
                        ).toLocaleDateString("en-GB")
                      : 0}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {" "}
                    {userDataApi?.mintCount
                      ? `${userDataApi.mintCount}/${
                          30 + (userDataApi?.cycleCount - 1) * 10
                        }`
                      : 0}
                  </td>
                  <td className="py-4 px-6 text-center">{lastMintedTimeForTable}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={handldeMintFunc}
                      className="bg-[linear-gradient(to_right,#FFE27A,#FFBA57,#98DB7C,#8BCAFF)] text-black font-bold py-2 px-10 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
                    >
                      {isLoading ? <Loader /> : " Mint"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </>
          ) : previousDataArray.length > 0 ? (
            <p className="text-center font-medium py-2">
              Start a new cycle with your next deposit!
            </p>
          ) : (
            <>
              <p className="text-center font-medium py-2">No Data Found!</p>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default MintTable;
