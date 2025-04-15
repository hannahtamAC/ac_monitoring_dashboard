type InputProps = {
  placeholder: string;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
};

const Input = ({ placeholder, searchTerm, setSearchTerm }: InputProps) => (
  <input
    type="text"
    placeholder={placeholder}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C60C30] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
);

export default Input;
