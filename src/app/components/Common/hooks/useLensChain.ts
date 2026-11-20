import { useConfig, useSwitchChain } from "wagmi";
import { getAccount, getWalletClient } from "wagmi/actions";
import { getCurrentNetwork } from "@/app/lib/constants";
import blockIfPaused from "@/app/lib/helpers/contractsPaused";

const useLensChain = () => {
  const config = useConfig();
  const { switchChainAsync } = useSwitchChain();
  const network = getCurrentNetwork();

  const ensureLensWallet = async () => {
    blockIfPaused();
    if (getAccount(config).chainId !== network.chainId) {
      await switchChainAsync({ chainId: network.chainId });
    }

    const wallet = await getWalletClient(config, {
      chainId: network.chainId,
    });

    if ((await wallet.getChainId()) !== network.chainId) {
      throw new Error("Wrong network");
    }

    return wallet;
  };

  return { ensureLensWallet };
};

export default useLensChain;
