import { useState, useEffect, useRef } from 'react';
import { useStates, useStateDistricts } from '../hooks';
import type { USState, VotingDistrict } from '../types/api';

const CongressionalMapNav = ({ 
  onMapSelection, 
  selectedState, 
  selectedDistrict,
  onZoomToHome,
  onZoomToState,
  onZoomToDistrict
}: { 
  onMapSelection?: (districtId?: string, stateName?: string) => void,
  selectedState?: string | null,
  selectedDistrict?: string | null,
  onZoomToHome?: () => void,
  onZoomToState?: (stateName: string) => void,
  onZoomToDistrict?: (districtId: string) => void
}) => {
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  
  // Fetch states and districts data
  const { data: states, isLoading: statesLoading } = useStates();
  const { data: districts, isLoading: districtsLoading } = useStateDistricts(
    states?.find(s => s.name === selectedState)?.id || ''
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowStateDropdown(false);
        setShowDistrictDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBreadcrumbClick = (type: 'home' | 'state' | 'district') => {
    switch (type) {
      case 'home':
        // Clear all selections and zoom to United States view
        onMapSelection?.(); // Clear both district and state
        onZoomToHome?.(); // Zoom to full US view
        break;
      case 'state':
        // Clear district selection but keep state and zoom to state
        onMapSelection?.(undefined, selectedState!); // Keep state, clear district
        onZoomToState?.(selectedState!); // Zoom to state
        break;
      case 'district':
        // Zoom to district (already selected)
        onZoomToDistrict?.(selectedDistrict!);
        break;
    }
  };

  const handleStateSelect = (state: USState) => {
    onMapSelection?.(undefined, state.name);
    onZoomToState?.(state.name);
    setShowStateDropdown(false);
  };

  const handleDistrictSelect = (district: VotingDistrict) => {
    const stateName = states?.find(s => s.id === district.us_state_id)?.name;
    if (stateName) {
      onMapSelection?.(district.district_code, stateName);
      onZoomToDistrict?.(district.district_code);
    }
    setShowDistrictDropdown(false);
  };

  const renderBreadcrumbItem = (text: string, isClickable: boolean = true, onClick?: () => void, showDropdown?: boolean, onDropdownToggle?: () => void) => (
    <li className="relative flex items-center gap-1" style={{ position: 'relative' }}>
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
             {showDropdown !== undefined && (
         <button
           onClick={(e) => {
             e.stopPropagation();
             onDropdownToggle?.();
           }}
           className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
         >
           {showDropdown ? '▲' : '▼'}
         </button>
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

  const renderStateDropdown = (states: USState[], onSelect: (state: USState) => void, isLoading: boolean, placeholder: string) => {
    if (isLoading) {
      return (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 p-2">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      );
    }

    return (
      <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
        {states.length === 0 ? (
          <div className="p-2 text-center text-gray-500">{placeholder}</div>
        ) : (
          states.map((state) => (
            <button
              key={state.id}
              onClick={() => onSelect(state)}
              className="w-full text-left px-3 py-2 hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors"
            >
              {state.name}
            </button>
          ))
        )}
      </div>
    );
  };

  const renderDistrictDropdown = (districts: VotingDistrict[], onSelect: (district: VotingDistrict) => void, isLoading: boolean, placeholder: string) => {
    if (isLoading) {
      return (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 p-2">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      );
    }

    return (
      <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
        {districts.length === 0 ? (
          <div className="p-2 text-center text-gray-500">{placeholder}</div>
        ) : (
          districts.map((district) => (
            <button
              key={district.id}
              onClick={() => onSelect(district)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              District {district.district_code}
            </button>
          ))
        )}
      </div>
    );
  };

  return (
    <>
      <nav ref={navRef} aria-label="Breadcrumb" className="relative">
        <ol className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200">
          {/* United States breadcrumb - always visible */}
          {renderBreadcrumbItem(
            'United States', 
            true, 
            () => handleBreadcrumbClick('home')
          )}
          
          {/* State breadcrumb - always visible with dropdown */}
          {renderSeparator()}
          {renderBreadcrumbItem(
            selectedState || 'Select State', 
            !!selectedState, 
            selectedState ? () => handleBreadcrumbClick('state') : undefined,
            true,
            () => setShowStateDropdown(!showStateDropdown)
          )}
          {showStateDropdown && states && renderStateDropdown(
            states,
            handleStateSelect,
            statesLoading,
            'No states available'
          )}
          
          {/* District breadcrumb - only visible when state is selected */}
          {selectedState && (
            <>
              {renderSeparator()}
              {renderBreadcrumbItem(
                selectedDistrict ? `District ${selectedDistrict}` : 'Select District', 
                !!selectedDistrict, 
                selectedDistrict ? () => handleBreadcrumbClick('district') : undefined,
                true,
                () => setShowDistrictDropdown(!showDistrictDropdown)
              )}
              {showDistrictDropdown && districts && renderDistrictDropdown(
                districts,
                handleDistrictSelect,
                districtsLoading,
                'No districts available'
              )}
            </>
          )}
        </ol>
      </nav>
    </>
  )
}

export default CongressionalMapNav