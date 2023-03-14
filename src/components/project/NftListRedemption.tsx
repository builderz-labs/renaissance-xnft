import { SetStateAction, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useWallet } from '../../hooks/useWallet';

import { NftItem } from '../nfts/NftItem';
import { getCheckedNftsForCollection } from '../../utils/nfts';
import { Loading } from '../Loading';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { repayRoyalties } from '../../utils/repayRoyalties';
import { useConnection } from '@solana/wallet-adapter-react';

export const NftListRedemption = ({
  collectionAddress,
}: {
  collectionAddress: string[];
}) => {
  const wallet = useWallet();
  const { connection } = useConnection()
  const [sortOrder, setSortOrder] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of items to display per page

  // Get checked NFTs
  const { data: checkedNfts, isLoading } = useQuery<any[]>({
    queryKey: ['checkedNfts', collectionAddress, wallet.publicKey],
    queryFn: () =>
      getCheckedNftsForCollection(
        wallet.publicKey ||
        new PublicKey('63Kaxzs8BxXh7sPZHDnAy9HwvkeLwJ3mF33EcXKSjpT9'),
        collectionAddress
      ),
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [totalToRepay, setTotalToRepay] = useState(0);

  const handlePageChange = (newPage: { selected: number }) => {
    setCurrentPage(newPage.selected + 1);
  };

  const pageCount = checkedNfts ? Math.ceil(checkedNfts.length / pageSize) : 0;
  const [showUnpaidRoyaltiesOnly, setShowUnpaidRoyaltiesOnly] = useState(false);
  const [selectAllUnpaid, setSelectAllUnpaid] = useState(false);

  const currentNfts = checkedNfts?.slice(startIndex, endIndex);
  const total = selectedItems.reduce((acc: any, item: any) => {
    return acc + item.royaltiesToPay;
  }, 0)

  // Set Total to Repay
  useEffect(() => {
    const total = selectedItems.reduce((acc: any, item: any) => {
      return acc + item.royaltiesToPay;
    }, 0)
    setTotalToRepay(total / LAMPORTS_PER_SOL);
  }, [selectedItems])




  // Set Select All Unpaid
  useEffect(() => {
    if (selectAllUnpaid) {
      const filteredNfts = currentNfts!.filter((nft) => !nft.royaltiesPaid && nft.status !== "error");
      setSelectedItems(filteredNfts)
    } else if (!selectAllUnpaid) {
      setSelectedItems([]);
    }
  }, [selectAllUnpaid])

  const handleRepay = async () => {
    setLoading(true)

    let itemsToRepay = [...selectedItems];
    if (selectAllUnpaid) {
      itemsToRepay = checkedNfts!.filter((nft) => nft.royaltiesToPay > 0);
    }
    try {
      const res = await repayRoyalties(itemsToRepay, connection, wallet);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

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
      <div className='absolute top-0 right-0'>


      </div>
      <div className="grid grid-cols-2 gap-4">
        {currentNfts?.map((nft: any) => {
          return <NftItem key={nft.tokenAddress} nft={nft} selectedItems={selectedItems} setSelectedItems={(items: any) => setSelectedItems(items)} setTotalToRepay={(items: any) => setTotalToRepay(items)} total={total} />;
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
        <div className='my-5  flex flex-col   items-end  justify-end  w-full gap-8'>
          <div className='w-full flex flex-row items-start justify-between gap-8 '>
            <div className='flex items-center justify-end gap-2 text-xs  '>
              <input type='checkbox' checked={selectAllUnpaid} onClick={() => setSelectAllUnpaid(!selectAllUnpaid)} />
              <label>Select All Unpaid</label>
            </div>
            <div className='flex items-center justify-end gap-2 text-xs '>
              {/*  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel>Sort</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SetStateAction<string>)}
                >
                  <MenuItem value={'asc'}>Price: Low to High</MenuItem>
                  <MenuItem value={'desc'}>Price: High to Low</MenuItem>
                </Select>
              </FormControl> */}
              <div className='flex items-center justify-end gap-2 text-xs '>
                <input type='checkbox' checked={showUnpaidRoyaltiesOnly} onClick={() => setShowUnpaidRoyaltiesOnly(!showUnpaidRoyaltiesOnly)} />
                <label>Show Unpaid Royalties Only</label>
              </div>
            </div>
          </div>
          <div className='flex flex-row gap-4 items-center justify-end w-full my-10  '>
            {selectedItems.length > 0 && <p className=' text-xs'>{selectedItems.length} NFT{selectedItems.length > 1 && "s"} selected</p>}
            <button onClick={handleRepay} disabled={selectedItems.length === 0} className={'btn btn-buy text-black  pt-0 pb-0 px-[36px] rounded-[120px] bg-[#ff8a57] border-2 border-gray-900 disabled:bg-[#3f3f3f]  disabled:cursor-not-allowed disabled:text-gray-100   hover:bg-[#fda680]' + (loading && " loading")}>Redeem {totalToRepay.toFixed(2)} SOL</button>
          </div>
        </div>
        <section className='my-10 mb-40'>
          <h2 className="text-3xl font-semibold mb-10">Other Collections</h2>
        </section>
      </div>
    </div>
  );
};
