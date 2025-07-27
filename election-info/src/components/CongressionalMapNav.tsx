const CongressionalMapNav = ({ 
  onMapSelection, 
  selectedState, 
  selectedDistrict 
}: { 
  onMapSelection?: (districtId?: string, stateName?: string) => void,
  selectedState?: string | null,
  selectedDistrict?: string | null
}) => {
  const handleBreadcrumbClick = (type: 'home' | 'state' | 'district') => {
    switch (type) {
      case 'home':
        // Clear all selections - go back to United States view
        onMapSelection?.(); // Clear both district and state
        break;
      case 'state':
        // Clear district selection but keep state
        onMapSelection?.(undefined, selectedState!); // Keep state, clear district
        break;
      case 'district':
        // Already at district level, no action needed
        break;
    }
  };

  const renderBreadcrumbItem = (text: string, isClickable: boolean = true, onClick?: () => void) => (
    <li>
      {isClickable ? (
        <button 
          onClick={onClick}
          className="block transition-colors hover:text-gray-900 dark:hover:text-white text-blue-600 dark:text-blue-400"
        >
          {text}
        </button>
      ) : (
        <span className="block text-gray-700 dark:text-gray-200">
          {text}
        </span>
      )}
    </li>
  );

  const renderSeparator = () => (
    <li className="rtl:rotate-180">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </li>
  );

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200">
          {renderBreadcrumbItem('United States', true, () => handleBreadcrumbClick('home'))}
          
          {selectedState && (
            <>
              {renderSeparator()}
              {renderBreadcrumbItem(selectedState, true, () => handleBreadcrumbClick('state'))}
            </>
          )}
          
          {selectedDistrict && (
            <>
              {renderSeparator()}
              {renderBreadcrumbItem(`District ${selectedDistrict}`, false)}
            </>
          )}
        </ol>
      </nav>
    </>
  )
}

export default CongressionalMapNav