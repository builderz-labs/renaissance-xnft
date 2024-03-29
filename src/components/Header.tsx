import { useMemo } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const basePaths = ['/', '/balance']; // Add more paths here if needed

const MyHeader = styled.header`
  background: linear-gradient(180deg, #060606 0%, rgba(6, 6, 6, 0) 100%);
`;

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = useMemo(() => {
    if (pathname !== '/') {
      const segments = pathname.split('/');
      return pathname.split('/')[segments.length - 1].replace('%20', " ");
    }
    return (
      <div className="flex items-center">
      <img className="mr-2" src='/renaissance-logo-no-padding.svg' height={28} width={28} />
      <p>
        re<span className="text-[#FF8A57]">:</span>
        <span className="lowercase">naissance</span>
      </p>
      </div>
    );
  }, [pathname]);
  return (
    <MyHeader className="w-full h-fit ">
      <div className="h-14 flex justify-between items-center gap-1 p-2">
        <div className="flex items-center gap-4">
          {!basePaths.some(base => pathname === base) && (
            <button onClick={() => navigate(-1)}>
              <FaChevronLeft />
            </button>
          )}
          <h1 className="text-left text-3xl inline capitalize font-bold">
            {title}
          </h1>
        </div>
      </div>
    </MyHeader>
  );
}
