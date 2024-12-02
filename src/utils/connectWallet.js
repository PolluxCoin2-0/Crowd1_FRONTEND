import { toast } from "react-toastify";

export async function getPolinkweb() {
  const intervalDuration = 500; // Reduced to 500ms for faster checks

  return new Promise((resolve, reject) => {
    const obj = setInterval(async () => {
      try {
        // Check if 'pox' object is available
        if (window.pox) {
          clearInterval(obj); // Clear interval once 'pox' is available
          
          // Get details from the 'pox' object
          const detailsData = await window.pox.getDetails();
          const parsedDetailsObject = JSON.parse(JSON.stringify(detailsData)); // Safely parse data
          console.log({ data: parsedDetailsObject})

          // Check for network condition
          // if (parsedDetailsObject[1]?.data?.Network === "Yuvi Testnet") {
          //   toast.error("Switch to Mainnet Network");
          //   reject(new Error("Network is Yuvi Testnet")); // Reject promise if the network is incorrect
          //   return;
          // }

          // Get wallet address
          const walletAddress = parsedDetailsObject[1]?.data;
          if (walletAddress) {
            resolve(walletAddress); // Resolve the promise with the wallet address
          } else {
            reject(new Error("Wallet address not found")); // Reject if wallet address is not found
          }
        }
      } catch (error) {
        console.error("Error fetching wallet details:", error);
        toast.error("An error occurred while fetching wallet details.");
        clearInterval(obj); // Clear interval on error
        reject(error); // Reject the promise on error
      }
    }, intervalDuration);
  });
}
