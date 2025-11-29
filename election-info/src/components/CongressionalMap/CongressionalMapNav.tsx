import { useState, useEffect, useRef } from 'react';
import { useStates, useStateDistricts } from '../../hooks';
import type { USState, VotingDistrict } from '../../types/api';
import { formatDistrictDisplay } from '../../lib/constants';

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

  const renderBreadcrumbItem = (text: string, isClickable: boolean = true, onClick?: () => void, hasDropdown?: boolean, onDropdownToggle?: () => void, isDropdownOpen?: boolean, isSelected?: boolean) => {
    if (hasDropdown !== undefined) {
      return (
        <div className="inline-flex items-center gap-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors px-1 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isSelected) {
                // If value is selected, clicking text navigates back
                onClick?.();
              } else {
                // If no value selected, clicking text opens dropdown
                onDropdownToggle?.();
              }
            }}
            className={`cursor-pointer ${
              isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            {text}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDropdownToggle?.();
            }}
            className="cursor-pointer"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="Toggle dropdown"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-gray-700 dark:text-gray-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      );
    }

    // Regular breadcrumb item without dropdown
    return (
      <>
        {isClickable ? (
          <button 
            onClick={onClick}
            className="block transition-colors hover:text-gray-900 dark:hover:text-white text-blue-600 dark:text-blue-400 cursor-pointer"
            title="Click to navigate back to this location"
          >
            {text}
          </button>
        ) : (
          <span className="block text-gray-700 dark:text-gray-200">
            {text}
          </span>
        )}
      </>
    );
  };

  const renderSeparator = () => (
    <li className=" text-gray-400 dark:text-gray-500 rtl:-rotate-[40deg]">/</li>
  );

  const renderStateDropdown = (states: USState[], onSelect: (state: USState) => void, isLoading: boolean, placeholder: string) => {
    if (isLoading) {
      return (
        <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-2">
            <div className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-y-auto">
        <div className="p-2">
          {states.length === 0 ? (
            <div className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{placeholder}</div>
          ) : (
            states.map((state) => (
              <button
                key={state.id}
                onClick={() => onSelect(state)}
                className="block w-full rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                {state.name}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderDistrictDropdown = (districts: VotingDistrict[], onSelect: (district: VotingDistrict) => void, isLoading: boolean, placeholder: string) => {
    if (isLoading) {
      return (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-2">
            <div className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-y-auto">
        <div className="p-2">
          {districts.length === 0 ? (
            <div className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{placeholder}</div>
          ) : (
            districts.map((district) => (
              <button
                key={district.id}
                onClick={() => onSelect(district)}
                className="block w-full rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                {formatDistrictDisplay(district.district_code)}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <nav ref={navRef} aria-label="Breadcrumb" className="relative mb-1">
        <ol className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
          {/* United States breadcrumb - always visible */}
          <li className="mr-1">
            {renderBreadcrumbItem(
              'United States', 
              true, 
              () => handleBreadcrumbClick('home')
            )}
          </li>
          
          {/* State breadcrumb - always visible with dropdown */}
          {renderSeparator()}
          <li className="relative">
            {renderBreadcrumbItem(
              selectedState || 'Select State', 
              !!selectedState, 
              selectedState ? () => handleBreadcrumbClick('state') : undefined,
              true,
              () => {
                setShowStateDropdown(!showStateDropdown);
                setShowDistrictDropdown(false);
              },
              showStateDropdown,
              !!selectedState
            )}
            {showStateDropdown && states && renderStateDropdown(
              states,
              handleStateSelect,
              statesLoading,
              'No states available'
            )}
          </li>
          
          {/* District breadcrumb - only visible when state is selected */}
          {selectedState && (
            <>
              {renderSeparator()}
              <li className="relative">
                {renderBreadcrumbItem(
                  selectedDistrict ? `District ${selectedDistrict}` : 'Select District', 
                  !!selectedDistrict, 
                  selectedDistrict ? () => handleBreadcrumbClick('district') : undefined,
                  true,
                  () => {
                    setShowDistrictDropdown(!showDistrictDropdown);
                    setShowStateDropdown(false);
                  },
                  showDistrictDropdown,
                  !!selectedDistrict
                )}
                {showDistrictDropdown && districts && renderDistrictDropdown(
                  districts,
                  handleDistrictSelect,
                  districtsLoading,
                  'No districts available'
                )}
              </li>
            </>
          )}
        </ol>
      </nav>
    </>
  )
}

export default CongressionalMapNav;

