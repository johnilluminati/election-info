import { useState, useRef, useLayoutEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

interface InfoTooltipProps {
  content: string;
  className?: string;
  position?: TooltipPosition;
}

const InfoTooltip = ({ content, className = '', position = 'auto' }: InfoTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<number | null>(null);

  // Calculate position once after tooltip renders to avoid visible shift
  useLayoutEffect(() => {
    if (!isVisible) {
      setTooltipStyle({});
      setArrowStyle({});
      return;
    }

    const calculatePosition = () => {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      
      if (!tooltip || !container) {
        // Tooltip not rendered yet, try again next frame
        updateTimeoutRef.current = requestAnimationFrame(calculatePosition);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const padding = 12;
      const tooltipWidth = tooltipRect.width || 256;
      const tooltipHeight = tooltipRect.height || 100;
      
      let finalPosition: TooltipPosition = position === 'auto' ? 'bottom' : position;
      
      if (position === 'auto') {
        const spaceAbove = containerRect.top - padding;
        const spaceBelow = window.innerHeight - containerRect.bottom - padding;
        const spaceLeft = containerRect.left - padding;
        const spaceRight = window.innerWidth - containerRect.right - padding;
        
        if (spaceBelow >= tooltipHeight) {
          finalPosition = 'bottom';
        } else if (spaceAbove >= tooltipHeight) {
          finalPosition = 'top';
        } else if (spaceRight >= tooltipWidth) {
          finalPosition = 'right';
        } else if (spaceLeft >= tooltipWidth) {
          finalPosition = 'left';
        } else {
          finalPosition = spaceBelow > spaceAbove ? 'bottom' : 'top';
        }
      }

      const style: React.CSSProperties = {
        position: 'fixed',
        zIndex: 9999,
        maxWidth: 'min(256px, calc(100vw - 24px))',
        opacity: 1, // Make visible after calculation
      };

      if (finalPosition === 'top' || finalPosition === 'bottom') {
        const containerCenterX = containerRect.left + containerRect.width / 2;
        let left = containerCenterX - tooltipWidth / 2;
        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
        style.left = `${left}px`;
        
        if (finalPosition === 'bottom') {
          style.top = `${containerRect.bottom + 8}px`;
        } else {
          style.bottom = `${window.innerHeight - containerRect.top + 8}px`;
        }
      } else if (finalPosition === 'left') {
        style.right = `${window.innerWidth - containerRect.left + 8}px`;
        style.top = `${containerRect.top + containerRect.height / 2 - tooltipHeight / 2}px`;
      } else if (finalPosition === 'right') {
        style.left = `${containerRect.right + 8}px`;
        style.top = `${containerRect.top + containerRect.height / 2 - tooltipHeight / 2}px`;
      }

      setTooltipStyle(style);

      // Calculate arrow style
      const arrowStyleProps: React.CSSProperties = {
        position: 'absolute',
        width: 0,
        height: 0,
      };

      if (finalPosition === 'top' || finalPosition === 'bottom') {
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const tooltipLeft = parseFloat(style.left as string);
        const arrowOffset = containerCenterX - tooltipLeft;
        
        arrowStyleProps.left = `${arrowOffset}px`;
        arrowStyleProps.transform = 'translateX(-50%)';
        
        if (finalPosition === 'bottom') {
          arrowStyleProps.bottom = '100%';
          arrowStyleProps.borderLeft = '4px solid transparent';
          arrowStyleProps.borderRight = '4px solid transparent';
          arrowStyleProps.borderBottom = '4px solid rgb(17 24 39)';
        } else {
          arrowStyleProps.top = '100%';
          arrowStyleProps.borderLeft = '4px solid transparent';
          arrowStyleProps.borderRight = '4px solid transparent';
          arrowStyleProps.borderTop = '4px solid rgb(17 24 39)';
        }
      } else if (finalPosition === 'left') {
        arrowStyleProps.right = '100%';
        arrowStyleProps.top = '50%';
        arrowStyleProps.transform = 'translateY(-50%)';
        arrowStyleProps.borderTop = '4px solid transparent';
        arrowStyleProps.borderBottom = '4px solid transparent';
        arrowStyleProps.borderLeft = '4px solid rgb(17 24 39)';
      } else if (finalPosition === 'right') {
        arrowStyleProps.left = '100%';
        arrowStyleProps.top = '50%';
        arrowStyleProps.transform = 'translateY(-50%)';
        arrowStyleProps.borderTop = '4px solid transparent';
        arrowStyleProps.borderBottom = '4px solid transparent';
        arrowStyleProps.borderRight = '4px solid rgb(17 24 39)';
      }

      // Dark mode support
      if (document.documentElement.classList.contains('dark')) {
        if (finalPosition === 'bottom') {
          arrowStyleProps.borderBottomColor = 'rgb(55 65 81)';
        } else if (finalPosition === 'top') {
          arrowStyleProps.borderTopColor = 'rgb(55 65 81)';
        } else if (finalPosition === 'left') {
          arrowStyleProps.borderLeftColor = 'rgb(55 65 81)';
        } else if (finalPosition === 'right') {
          arrowStyleProps.borderRightColor = 'rgb(55 65 81)';
        }
      }

      setArrowStyle(arrowStyleProps);
    };

    // Start with invisible tooltip, then calculate and show
    setTooltipStyle({
      position: 'fixed',
      opacity: 0,
      pointerEvents: 'none',
    });

    // Calculate position after tooltip renders
    updateTimeoutRef.current = requestAnimationFrame(calculatePosition);

    return () => {
      if (updateTimeoutRef.current) {
        cancelAnimationFrame(updateTimeoutRef.current);
      }
    };
  }, [isVisible, position]);

  const getTooltipClasses = () => {
    return "w-64 p-3 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg pointer-events-none";
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <button
        type="button"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:transform-none rounded-full ml-1"
        aria-label="More information"
        aria-expanded={isVisible}
        onMouseDown={(e) => e.preventDefault()} // Prevent visual click feedback
      >
        <FaInfoCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={getTooltipClasses()}
          style={tooltipStyle}
          role="tooltip"
        >
          {content}
          {Object.keys(arrowStyle).length > 0 && (
            <div style={arrowStyle} />
          )}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;

