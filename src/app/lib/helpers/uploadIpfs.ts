import blockIfPaused from "@/app/lib/helpers/contractsPaused";

const uploadIpfs = async (payload: File | object): Promise<string> => {
  blockIfPaused();
  let response: Response;

  if (typeof File !== "undefined" && payload instanceof File) {
    const formData = new FormData();
    formData.append("file", payload);
    response = await fetch("/api/ipfs", {
      method: "POST",
      body: formData,
    });
  } else {
    response = await fetch("/api/ipfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    throw new Error("IPFS upload failed");
  }

  const result = await response.json();
  const hash = result?.hash;

  if (typeof hash !== "string" || hash.trim() === "") {
    throw new Error("IPFS upload failed");
  }

  return "ipfs://" + hash;
};

export default uploadIpfs;
