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
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [totalToRepay, setTotalToRepay] = useState(0);

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
        <div className='my-5  flex flex-col md:flex-row  items-end md:items-center justify-end md:justify-center w-full gap-8'>
          <div className='w-full flex flex-row items-start justify-between gap-8 '>
            <div /* onClick={() => setSelectAllUnpaid(!selectAllUnpaid)} */ className='flex items-center justify-end gap-2 text-[10px]  '>
              <input type='checkbox' /* checked={selectAllUnpaid}  */ />
              <p>Select all unpaid royalties</p>
            </div>
            <div className='flex justify-end'>
              <label className='flex items-center gap-2 text-[10px]  '>
                <input type='checkbox' />
                Show unpaid royalties only
              </label>
            </div>
          </div>
          <div className='flex flex-row md:flex-col-reverse lg:flex-row gap-4 items-start md:items-center justify-end w-full my-10 md:my-0  lg:w-[50%]'>
            {selectedItems.length > 0 && <p className=' '>{selectedItems.length} NFT{selectedItems.length > 1 && "s"} selected ({selectedItems.length > 0 && (totalToRepay.toFixed(2))} SOL) </p>}
            <button disabled={selectedItems.length === 0} className={'btn btn-buy text-black  pt-0 pb-0 px-[36px] rounded-[120px] bg-[#ff8a57] border-2 border-gray-900 disabled:bg-[#3f3f3f]  disabled:cursor-not-allowed disabled:text-gray-100   hover:bg-[#f5fd9c]' + (loading && " loading")}>Redeem</button>
          </div>
        </div>
        <section className='my-10 mb-40'>
          <h2 className="text-3xl font-semibold mb-10">Other Collections</h2>
        </section>
      </div>
    </div>
  );
};
