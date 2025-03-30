import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = () => {
  return (
    <div className="flex items-center px-4 bg-slate-100 dark:bg-[#212529] rounded-md">
      <input
        type="text"
        placeholder="Search"
        className="w-full text-xs bg-transparent py-1.5 outline-none dark:text-slate-100 text-[1rem]"
      />
      <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-black dark:hover:text-white" />
    </div>
  )
}

export default SearchBar;