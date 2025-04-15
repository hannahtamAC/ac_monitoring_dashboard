import { SearchIcon } from "lucide-react";
import { useState } from "react";
import Input from "./shared/Input";

type SearchInputProps = {
  placeholder: string;
};

const SearchInput = ({ placeholder }: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative flex-1 max-w-xs">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default SearchInput;
