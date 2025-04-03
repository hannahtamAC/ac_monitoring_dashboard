const DropDown = () => {
  return (
    <select
      className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-700 dark:text-gray-200"
      value={filters.flightType}
      onChange={(e) =>
        setFilters({
          ...filters,
          flightType: e.target.value,
        })
      }
    >
      <option value="all">All Routes</option>
      <option value="domestic">Domestic</option>
      <option value="transborder">Transborder</option>
      <option value="international">International</option>
    </select>
  );
};

export const DropDown;
