import { CONTRACTS_PAUSED, CONTRACTS_PAUSED_EVENT } from "@/app/lib/constants";

const blockIfPaused = (): void => {
  if (!CONTRACTS_PAUSED) return;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONTRACTS_PAUSED_EVENT));
  }
  throw new Error(CONTRACTS_PAUSED_EVENT);
};

export default blockIfPaused;
