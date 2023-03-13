import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '../../hooks/useWallet';

import { NftItem } from '../nfts/NftItem';
import { getCheckedNftsForCollection } from '../../utils/nfts';
import { Loading } from '../Loading';

export const NftListRedemption = ({
  collectionAddress,
}: {
  collectionAddress: string;
}) => {
  const wallet = useWallet();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of items to display per page

  // Get checked NFTs
  const { data: checkedNfts, isLoading } = useQuery<any[]>({
    queryKey: ['checked', collectionAddress, wallet.publicKey],
    queryFn: () =>
      getCheckedNftsForCollection(
        wallet.publicKey ||
          new PublicKey('63Kaxzs8BxXh7sPZHDnAy9HwvkeLwJ3mF33EcXKSjpT9'),
        [collectionAddress]
      ),
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentNfts = checkedNfts?.slice(startIndex, endIndex);

  const handlePageChange = (newPage: { selected: number }) => {
    setCurrentPage(newPage.selected + 1);
  };

  const pageCount = checkedNfts ? Math.ceil(checkedNfts.length / pageSize) : 0;

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
      <div className="grid grid-cols-2 gap-4">
        {currentNfts?.map((nft: any) => {
          return <NftItem key={nft.tokenAddress} nft={nft} />;
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
      </div>
    </div>
  );
};
