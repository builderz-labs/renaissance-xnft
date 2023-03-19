import { NavLink } from 'react-router-dom';
import { FaHome, FaImage } from 'react-icons/fa';
import { RiVipCrownLine } from 'react-icons/ri';
import crown from '../assets/crown.png';

const tabs = [
  // TODO: Add more tabs
  { name: 'Home', path: '/', icon: FaHome },
  { name: 'NFTs', path: 'nfts', icon: FaImage },
  { name: 'Ranking', path: 'ranking', icon: RiVipCrownLine },
];

export function Tabs() {
  return (
    <nav className="w-full max-w-md mx-auto p-0 fixed bottom-0 left-0 z-[999] h-fit bg-black ">
      <div role="tablist" className="flex flex-row justify-center">
        {tabs.map(tab => {
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex-1 px-2 py-1 m-4 hover:text-[#E6813E] rounded-2xl ${isActive
                  ? 'text-black bg-[#E6813E] hover:text-white'
                  : 'text-gray-500'
                }`
              }
            >
              <div role="tab" className="flex flex-col items-center">
                <tab.icon />
                <span>{tab.name}</span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
