import React, { useEffect, useState, useRef } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
export const MultiSelect = ({
  options,
  selected,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const toggleOption = value => {
    const newSelected = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
    onChange(newSelected);
  };
  const displayValue = selected.length === 0 ? 'All Operators' : selected.length === options.length ? 'All Selected' : `${selected.length} Selected`;
  return <div className="relative" ref={ref}>
      <button type="button" className="flex items-center justify-between w-32 text-sm text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        <span className="truncate">{displayValue}</span>
        <ChevronsUpDownIcon className="h-4 w-4 text-gray-400" />
      </button>
      {isOpen && <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          {options.map(option => <div key={option.value} className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => toggleOption(option.value)}>
              <div className={`
                w-4 h-4 border rounded mr-2 flex items-center justify-center
                ${selected.includes(option.value) ? 'border-[#C60C30] bg-[#C60C30]' : 'border-gray-300 dark:border-gray-600'}
              `}>
                {selected.includes(option.value) && <CheckIcon className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm">{option.label}</span>
            </div>)}
        </div>}
    </div>;
};