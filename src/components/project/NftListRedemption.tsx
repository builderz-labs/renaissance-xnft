import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "../../hooks/useWallet";

import { NftItem } from "../nfts/NftItem";
import { getCheckedNftsForCollection } from "../../utils/nfts";
import { Loading } from "../Loading";
import { repayRoyalties } from "../../utils/repayRoyalties";
import { useConnection } from "@solana/wallet-adapter-react";

export const NftListRedemption = ({
  collectionAddress,
}: {
  collectionAddress: string[];
}) => {
  // Solana
  const wallet = useWallet();
  const { connection } = useConnection();

  // Get checked NFTs
  const { data: checkedNfts, isLoading } = useQuery<any[]>({
    queryKey: ["checkedNfts", collectionAddress, wallet.publicKey],
    queryFn: () =>
      getCheckedNftsForCollection(
        wallet.publicKey ||
        new PublicKey("63Kaxzs8BxXh7sPZHDnAy9HwvkeLwJ3mF33EcXKSjpT9"),
        collectionAddress
      ),
  });
  // Filtered NFT states
  const [filteredNfts, setFilteredNfts] = useState<any[]>([]);
  const [currentNfts, setCurrentNfts] = useState<any[]>([]);

  // Populate state as soon as checkedNfts is available
  useEffect(() => {
    if (checkedNfts) {
      setCurrentNfts(checkedNfts.slice(startIndex, endIndex));
      setFilteredNfts(checkedNfts);
    }
  }, [checkedNfts])

  // Pagination
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of items to display per page

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  useEffect(() => {
    if (filteredNfts) {
      const pageCount = Math.ceil(filteredNfts.length / pageSize);
      setPageCount(pageCount);
    }
  }, [filteredNfts])

  const handlePageChange = (newPage: { selected: number }) => {
    setCurrentPage(newPage.selected + 1);
  };

  // State for repayment
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [totalToRepay, setTotalToRepay] = useState(0);

  // Display filters
  const [showUnpaidRoyaltiesOnly, setShowUnpaidRoyaltiesOnly] = useState(false);
  const [selectAllUnpaid, setSelectAllUnpaid] = useState(false);

  // Show unpaid only
  useEffect(() => {
    if (checkedNfts) {
      let filteredNfts: any[] = checkedNfts;
      if (showUnpaidRoyaltiesOnly) {
        filteredNfts = checkedNfts!.filter(
          (nft) => !nft.royaltiesPaid && nft.status !== "error"
        );
      }
      setCurrentNfts(filteredNfts.slice(startIndex, endIndex));
      setFilteredNfts(filteredNfts);
    }
  }, [endIndex, startIndex, showUnpaidRoyaltiesOnly]);

  // Set Total to Repay
  useEffect(() => {
    const total = selectedItems.reduce((acc: any, item: any) => {
      return acc + item.royaltiesToPay;
    }, 0);
    setTotalToRepay(total / LAMPORTS_PER_SOL);
  }, [selectedItems]);

  //  Select All Unpaid
  useEffect(() => {
    if (selectAllUnpaid) {
      const filteredNfts = checkedNfts!.filter(
        (nft) => !nft.royaltiesPaid && nft.status !== "error"
      );
      setSelectedItems(filteredNfts);
    } else if (!selectAllUnpaid) {
      setSelectedItems([]);
    }
  }, [selectAllUnpaid]);

  // Repay Royalties
  const handleRepay = async () => {
    setLoading(true);

    let itemsToRepay = [...selectedItems];
    if (selectAllUnpaid) {
      itemsToRepay = checkedNfts!.filter((nft) => nft.royaltiesToPay > 0);
    }
    try {
      const res = await repayRoyalties(itemsToRepay, connection, wallet);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // While loading return Loader
  if (isLoading) {
    return <Loading />;
  }

  // If no NFTs of collection return message
  if (checkedNfts && checkedNfts.length === 0) {
    return (
      <div>
        <h2>You don't own any NFTs of this collection</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-40">
        {currentNfts?.map((nft: any) => {
          return (
            <NftItem
              key={nft.tokenAddress}
              nft={nft}
              selectedItems={selectedItems}
              setSelectedItems={(items: any) => setSelectedItems(items)}
            />
          );
        })}
      </div>
      <div>
        {checkedNfts && checkedNfts.length > pageSize && (
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageChange}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-previous-item"
            nextClassName="page-next-item"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            activeClassName="active"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="<"
          />
        )}
        <div className="my-5  flex flex-col   items-end  justify-end  w-full gap-8">
          <div className="w-full flex flex-row items-start justify-between gap-8 ">
            <div className="flex items-center justify-end gap-2 text-xs  ">
              <input
                type="checkbox"
                checked={selectAllUnpaid}
                onClick={() => setSelectAllUnpaid(!selectAllUnpaid)}
              />
              <label>Select All Unpaid</label>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs ">
              <div className="flex items-center justify-end gap-2 text-xs ">
                <input
                  type="checkbox"
                  checked={showUnpaidRoyaltiesOnly}
                  onClick={() =>
                    setShowUnpaidRoyaltiesOnly(!showUnpaidRoyaltiesOnly)
                  }
                />
                <label>Show Unpaid Royalties Only</label>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center justify-end w-full my-10  ">
            {selectedItems.length > 0 && (
              <p className=" text-xs">
                {selectedItems.length} NFT{selectedItems.length > 1 && "s"}{" "}
                selected
              </p>
            )}
            <button
              onClick={handleRepay}
              disabled={selectedItems.length === 0}
              className={
                "btn btn-buy text-black  pt-0 pb-0 px-[36px] rounded-[120px] bg-[#ff8a57] border-2 border-gray-900 disabled:bg-[#3f3f3f]  disabled:cursor-not-allowed disabled:text-gray-100 hover:bg-[#ffd19d]  " +
                (loading && " loading")
              }
            >
              Redeem {totalToRepay.toFixed(2)} SOL
            </button>
          </div>
        </div>
        {/*       <section className="my-10 mb-40">
          <h2 className="text-3xl font-semibold mb-10">Other Collections</h2>
        </section> */}
      </div>
    </div>
  );
};
