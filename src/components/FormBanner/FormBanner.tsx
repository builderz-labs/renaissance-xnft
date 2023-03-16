import React, { useState } from 'react';

function FormBanner() {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <>
            {isVisible && (
                <section>
                    {/* Banner */}
                    <div className="w-full flex flex-row justify-between items-center py-2 bg-renaissance-orange bg-opacity-40 rounded-md ">
                        <div className=" flex items-center justify-center h-full">
                            <p className="px-2 text-[10px] font-semibold">
                                Submit the{' '}
                                <a href="" className="underline">
                                    form
                                </a>{' '}
                                to get your Collection whitelisted!
                            </p>
                        </div>
                        <div
                            className={`flex items-center justify-center w-1/6 cursor-pointer transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-0'
                                }`}
                            onClick={handleClose}
                        >
                            x
                        </div>
                    </div>
                    <p className="text-[14px] px-2 py-4 text-start max-w-xs">
                        It's Re
                        <span className="text-renaissance-orange">:</span>naissance Royalty Redemption! Redeem your
                        royalties - your project might reward you!
                    </p>
                </section>
            )}
        </>
    );
}

export default FormBanner;
