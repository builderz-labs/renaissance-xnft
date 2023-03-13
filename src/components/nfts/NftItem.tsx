import styled from 'styled-components';
import { Popover } from 'antd';
import VerifiedIcon from '@mui/icons-material/Verified';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import DiamondIcon from '@mui/icons-material/Diamond';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';

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

export const NftItem = ({ nft, selectedItems, setSelectedItems }: any) => {

  /*  const handleCheck = (nft: any) => {
     if (nft.royaltiesPaid || nft.status === "error") {
       return;
     }
 
     if (selectedItems.includes(nft)) {
       setSelectedItems(selectedItems.filter((item: any) => item !== nft));
     } else {
       setSelectedItems([...selectedItems, nft]);
     }
   };
 
   const isSelected = selectedItems.includes(nft);
  */

  return (
    <ItemCard /* onClick={() => handleCheck(nft)} */ key={nft.tokenAddress}

      className=" rounded-lg relative">
      {/* If never sold, display icon */}
      {/* other statuses: paid-with-tool, partial, paid-at-sale, error */}
      {nft.status === "error" && (
        <div className="absolute bottom-5 right-2  w-6 h-6 rounded-sm  ">
          <Popover content='Error' title="Error">
            <WarningIcon className='text-red-500' />
          </Popover>
        </div>
      )}
      {nft.status === "never-sold" && (
        <div className="absolute bottom-5 right-2  w-6 h-6 rounded-sm  ">
          <Popover content='Never Sold' title="Diamond Hand">
            <DiamondIcon className='text-orange-500' />
          </Popover>
        </div>
      )}
      {nft.status === "paid-with-tool" && (
        <div className="absolute bottom-5 right-2  w-6 h-6 rounded-sm  ">
          <Popover content='Paid with Tool' title="Paid with Tool">
            <VerifiedUserIcon className='text-purple-500' />
          </Popover>
        </div>
      )}
      {nft.status === "partial" && (
        <div className="absolute bottom-5 right-2  w-6 h-6 rounded-sm  ">
          <Popover content='Partially Paid' title="Partially Paid">
            <AssistantPhotoIcon className='text-orange-500' />
          </Popover>
        </div>
      )}
      {nft.status === "paid-at-sale" && (
        <div className="absolute bottom-5 right-2  w-6 h-6 rounded-sm  ">
          <Popover content='Paid at Sale' title="Paid at Sale">
            <VerifiedIcon className='text-orange-500' />
          </Popover>
        </div>
      )}
      {/*          {nft.royaltiesPaid && (
              <div className="absolute bottom-11 right-4 w-6 h-6 rounded-sm  ">
                <Popover content='Royalties Paid' title="Chad">
                  <BeenhereIcon className='text-green-500' />
                </Popover>
              </div>
            )} */}
      <div className={`w-70 h-70 object-cover rounded-lg ${nft.royaltiesPaid ? ' ' : 'border-[#FF5557]'} `}>
        {(!nft.royaltiesPaid && nft.status !== "error") && (
          <div className="absolute top-1 right-4 md:top-12 md:right-8  md:w-3 md:h-3 rounded-md shadow-sm ">
            <input type="checkbox" className='rounded-sm' /* checked={isSelected} */ readOnly />
          </div>
        )}
        <img
          src={nft.imageUrl}
          width={150}
          height={150}
          alt="NFT"
          className={`p-2 w-full h-40 object-cover rounded-lg  ${nft.royaltiesPaid ? '' : ' border-2 border-[#FF5557]'}`}
        />
      </div>
      <p className="font-medium my-2 px-2  text-start max-w-40 text-xl truncate hover:text-[#FF8A57]">
        {nft.name}
      </p>
      {/*     {nft.royaltiesPaid ? (
        <p className="text-[#53EC98] font-medium text-[14px]">Redeemed</p>
      ) : <p className='text-[#FF5557] font-medium text-[14px]'>Outstanding</p>} */}
    </ItemCard>
  );
};
