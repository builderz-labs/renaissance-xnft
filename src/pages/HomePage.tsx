import { Background } from "../components/Background";
import { Logo } from "../components/Logo";

export const HomePage = () => {
  return (
    <div className="h-full">
          <Background role="banner" className="-mt-2 -mx-2 mb-2 py-4">
            <Logo className="max-w-[300px] mx-auto" />
            <h2 className="text-white font-bold">xNFT Starter</h2>
          </Background>
    </div>
  );
}