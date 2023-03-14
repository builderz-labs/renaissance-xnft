import styled from 'styled-components';
import { Popover } from 'antd';
import VerifiedIcon from '@mui/icons-material/Verified';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import DiamondIcon from '@mui/icons-material/Diamond';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import { Checkbox, Tooltip } from '@mui/material';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const ItemCard = styled.div`
  background: linear-gradient(206.07deg, #050505 30.45%, #101c26 99.29%);
  border-radius: 12px;

  border: 0.5px solid;

  border-image-source: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 138, 87, 0.1) 100%
  );
`;
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export const NftItem = ({ nft, selectedItems, setSelectedItems, setTotalToRepay, total }: any) => {

  const handleCheck = (nft: any) => {
    if (nft.royaltiesPaid || nft.status === "error") {
      return;
    }

    if (selectedItems.includes(nft)) {
      setSelectedItems(selectedItems.filter((item: any) => item !== nft));
    } else {
      setSelectedItems([...selectedItems, nft]);
    }
    setTotalToRepay(total / LAMPORTS_PER_SOL);
  };

  const isSelected = selectedItems.includes(nft);
  const isUnpaid = !nft.royaltiesPaid && nft.status !== "error";


  return (
    <ItemCard onClick={() => handleCheck(nft)} key={nft.tokenAddress}

      className=" rounded-lg relative pb-4">
      {/* If never sold, display icon */}
      {/* other statuses: paid-with-tool, partial, paid-at-sale, error */}
      {nft.status === "error" && (
        <div className="absolute bottom-6 right-4 bg-black bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip placement="top-end" title="Error">
            <WarningIcon className='text-red-500' />
          </Tooltip>
        </div>
      )}
      {nft.status === "never-sold" && (
        <div className="absolute bottom-6 pt-1 right-4 bg-black bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip placement="top-end" title="Diamond Hand - Never Sold">
            <DiamondIcon className='text-orange-500' />
          </Tooltip>
        </div>
      )}
      {nft.status === "paid-with-tool" && (
        <div className="absolute bottom-6 right-4 bg-black bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip placement="top-end" title="Paid with Tool">
            <VerifiedUserIcon className='text-purple-500' />
          </Tooltip>
        </div>
      )}
      {nft.status === "partial" && (
        <div className="absolute bottom-6 right-4 bg-black bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip placement="top-end" title="Partially Paid">
            <AssistantPhotoIcon className='text-orange-500' />
          </Tooltip>
        </div>
      )}
      {nft.status === "paid-at-sale" && (
        <div className="absolute bottom-6 right-4 bg-black bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip title="Paid at Sale" placement="top">
            <VerifiedIcon className='text-orange-500' />
          </Tooltip>
        </div>
      )}
      {/*       {nft.royaltiesPaid && (
        <div className="absolute bottom-11 right-2 w-6 h-6 rounded-sm  ">
          <Popover content='Royalties Paid' title="Chad">
            <BeenhereIcon className='text-green-500' />
          </Popover>
        </div>
      )} */}
      <div className={`w-70 h-70 object-cover rounded-lg ${nft.royaltiesPaid ? ' ' : 'border-[#FF5557]'} `}>
        {(!nft.royaltiesPaid && nft.status !== "error") && (
          <div className="absolute top-2 right-2 rounded-md shadow-sm ">
            <Checkbox
              {...label}
              checked={isSelected} readOnly
              sx={{
                color: '#ffaa85',
                '&.Mui-checked': {
                  color: '#FF8A57',
                },
              }}
            />
          </div>
        )}
        <img
          src={nft.imageUrl}
          width={150}
          height={150}
          alt="NFT"
          className={`p-2 w-full h-40 object-cover rounded-lg  ${nft.royaltiesPaid ? '' : ' border-2 border-opacity-40  border-[#FF5557]'} ${isSelected ? 'border-opacity-100' : 'border-opacity-40'}}`}
        />
      </div>
      <p className="font-medium my-2 px-2  text-start w-36 text-xl truncate hover:text-[#FF8A57]">
        {nft.name}
      </p>
      {isUnpaid && <p className="text-red-500 text-start text-[8px] ml-2">Outstanding: {nft.royaltiesToPay / LAMPORTS_PER_SOL} SOL</p>}
      {/*    {nft.royaltiesPaid ? (
        <p className="text-[#FF8A57] font-medium px-2 text-start  text-[14px]">Redeemed</p>
      ) : <p className='text-[#FF5557] font-medium px-2 text-start text-[14px]'>Outstanding</p>} */}
    </ItemCard>
  );
};
