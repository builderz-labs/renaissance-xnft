function Search() {
    return (
        <section className='my-4 w-full '>
            <div className='relative w-full px-2'>
                <label className='w-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute top-[14px] left-[22px] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Search NFT collection ..." className="input pl-12 bg-transparent input-bordered w-full px-2" />
                </label>
            </div>
        </section>
    )
}

export default Search