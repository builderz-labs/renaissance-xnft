import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from 'react-paginate';

import { NftItem } from "./NftItem";

export const NftList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of items to display per page

  const { data: nfts } = useQuery<any[]>({
    queryKey: ["nfts"],
    enabled: !!currentPage, // only fetch data when currentPage is set
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentNfts = nfts?.slice(startIndex, endIndex);

  const handlePageChange = (newPage: { selected: number }) => {
    setCurrentPage(newPage.selected + 1);
  };

  if (nfts && nfts.length === 0) {
    return (
      <div>
        <h2>You don't own any NFTs</h2>
      </div>
    )
  }

  const pageCount = Math.ceil(nfts!.length / pageSize);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {currentNfts?.map((nft: any) => {
          return <NftItem key={nft.tokenAddress} nft={nft} />;
        })}
      </div>
      <div>
        {nfts && nfts.length > pageSize && (
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
      </div>
    </div>
  )
}
