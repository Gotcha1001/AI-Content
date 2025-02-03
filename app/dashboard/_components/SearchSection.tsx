import { Search } from "lucide-react";
import React from "react";

function SearchSection({ onSearchInput }: any) {
  return (
    <div className="p-10 bg-gradient-to-br from-purple-500 via-purple-700 to-blue-800 flex flex-col justify-center items-center">
      <h2 className="gradient-title text-4xl font-bold">
        Browse All Templates
      </h2>
      <p className="text-white">What would you like to create today?</p>
      <div className="w-full flex justify-center">
        <div className="flex gap-2 items-center p-3 border rounded-md bg-white mt-5 sm:w-[50%]">
          <Search className="text-primary" />
          <input
            onChange={(event) => onSearchInput(event.target.value)}
            type="text"
            placeholder="Search"
            className="p-1 rounded-xl bg-transparent w-full outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchSection;
