import { SearchIcon } from "lucide-react";
import Input from "./shared/Input";

type SearchInputProps = {
  placeholder: string;
  value: string;
  onChange: (s: string) => void;
};

const SearchInput = ({ placeholder, value, onChange }: SearchInputProps) => {
  return (
    <div className="relative flex-1 max-w-xs">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        searchTerm={value}
        setSearchTerm={onChange}
      />
    </div>
  );
};

export default SearchInput;
