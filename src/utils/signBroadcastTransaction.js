import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { broadcastApi } from "../utils/api/apiFunctions";
import { checkTransactionStatus } from "./TransactionResult";

export const SignBroadcastTransactionStatus = async (rawData, isUserSr) => {
  try {
    if (!window.pox) {
      throw new Error("Wallet extension is not available.");
    }

    // SIGN TRANSACTION
    let signedTransaction = null;
    if (isUserSr) {
      signedTransaction = await window.pox.multiSign(rawData);
    } else {
      signedTransaction = await window.pox.signdata(rawData);
    }
    console.log({ signedTransaction });

    if (signedTransaction[2] !== "Sign data Successfully") {
      toast.error("Sign data failed!");
      throw new Error("Sign data failed!");
    }

    // BROADCAST TRANSACTION
    const parsedSignedTransaction = JSON.parse(signedTransaction[1]);
    const broadcast = await broadcastApi(parsedSignedTransaction);
    console.log({ broadcast });

    if (!broadcast?.txid) {
      toast.error("Broadcast failed!");
      throw new Error("Broadcast failed!");
    }

    // CHECK TRANSACTION STATUS
    const transactionStatus = await checkTransactionStatus(broadcast.txid);
    console.log({ transactionStatus });

    return {
      txid: broadcast.txid,
      transactionStatus,
    };
  } catch (error) {
    console.error("Transaction Error",error);
    toast.error( "An unexpected error occurred.");
  }
};
