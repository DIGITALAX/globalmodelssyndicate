"use client";

import { FunctionComponent, useContext } from "react";
import { ModalContext, CartItem } from "@/app/providers";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const Cart: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const context = useContext(ModalContext);
  // const { handleBuyBatch, batchLoading } = usePurchase(dict, undefined);
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const totalPrice = context?.cartItems.reduce(
    (sum, item) => sum + parseFloat(item.collection.price) * item.amount,
    0
  );

  // const handlePurchaseAll = async () => {
  //   await handleBuyBatch(context?.cartItems || []);
  //   context?.clearCart();
  // };

  if (!context?.cartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="border-b-2 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {dict?.cart} ({context?.cartItems.length})
          </h2>
          <div className="relative flex flex-row gap-2 items-center">
            {isConnected ? (
              <button
                onClick={() => disconnect()}
                className="text-xs bg-red-600 text-white px-3 py-1 hover:bg-red-700 transition-colors"
              >
                {dict?.disconnectWallet}
              </button>
            ) : (
              <ConnectKitButton.Custom>
                {({ show }) => (
                  <button
                    onClick={show}
                    className="text-xs bg-black text-white px-3 py-1 hover:bg-gray-800 transition-colors"
                  >
                    {dict?.connectWalletButton}
                  </button>
                )}
              </ConnectKitButton.Custom>
            )}
            <button
              onClick={() => context?.setCartOpen(false)}
              className="text-2xl hover:bg-gray-200 w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {context?.cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {dict?.emptyCart}
            </div>
          ) : (
            context?.cartItems.map((item: CartItem) => (
              <div
                key={item.collection.collectionId}
                className="flex gap-4 border-b border-gray-200 py-4"
              >
                <div className="relative w-20 h-20">
                  {item.collection.metadata?.mediaType === "mp4" ? (
                    <video
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover border border-black"
                    >
                      <source
                        src={`${INFURA_GATEWAY}/ipfs/${
                          item.collection.metadata.media?.split("ipfs://")?.[1]
                        }`}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        item.collection.metadata?.media?.split("ipfs://")?.[1]
                      }`}
                      alt={item.collection.metadata?.title || ""}
                      layout="fill"
                      draggable={false}
                      objectFit="cover"
                      className="border border-black"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-sm">
                    {item.collection.metadata?.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {Number(item.collection.price) / 10 ** 18} MONA
                  </p>
                  <div className="text-xs text-gray-600">
                    {dict?.dropLabel}: {item.collection.drop?.metadata?.title}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        if (item.amount == 0) return;
                        context?.updateCartAmount(
                          item.collection.collectionId,
                          item.amount - 1
                        );
                      }}
                      disabled={item.amount == 0}
                      className="bg-gray-200 w-6 h-6 text-sm hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-sm w-8 text-center">
                      {item.amount}
                    </span>
                    <button
                      onClick={() => {
                        if (
                          item.amount + 1 >
                          Number(item.collection.edition) -
                            Number(item.collection.tokenIds.length)
                        )
                          return;
                        context?.updateCartAmount(
                          item.collection.collectionId,
                          item.amount + 1
                        );
                      }}
                      disabled={
                        item.amount + 1 >
                        Number(item.collection.edition) -
                          Number(item.collection.tokenIds.length)
                      }
                      className="bg-gray-200 w-6 h-6 text-sm hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        context?.removeFromCart(item.collection.collectionId)
                      }
                      className="text-red-600 text-sm ml-auto hover:underline"
                    >
                      {dict?.remove}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">
                    {(
                      Number(parseFloat(item.collection.price) * item.amount) /
                      10 ** 18
                    ).toFixed(2)}{" "}
                    MONA
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {context?.cartItems.length > 0 && (
          <div className="border-t-2 border-black p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">
                {dict?.total}: {(Number(totalPrice) / 10 ** 18)?.toFixed(2)}{" "}
                MONA
              </span>
              <button
                onClick={context?.clearCart}
                className="text-sm text-red-600 hover:underline"
              >
                {dict?.clearCart}
              </button>
            </div>
{/* 
            <button
              onClick={handlePurchaseAll}
              disabled={batchLoading}
              className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {batchLoading
                ? dict?.buying
                : `${dict?.buyAll} (${(Number(totalPrice) / 10 ** 18)?.toFixed(
                    2
                  )} MONA)`}
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
