import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertCircle, X } from 'lucide-react';

interface SearchableSelectOption {
  value: string | number;
  label: string;
}

interface CoreUISearchableSelectProps {
  label: string;
  placeholder?: string;
  options: SearchableSelectOption[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  onSearch?: (searchTerm: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  isLoading?: boolean;
  isLarge?: boolean;
}

const CoreUISearchableSelect: React.FC<CoreUISearchableSelectProps> = ({
  label,
  placeholder = 'Search and select...',
  options,
  value,
  onChange,
  onSearch,
  error,
  required = false,
  disabled = false,
  clearable = true,
  className = '',
  isLoading = false,
  isLarge = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected label
  const selectedOption = options.find(opt => opt.value === value);
  const selectedLabel = selectedOption?.label || '';

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelectOption = (option: SearchableSelectOption) => {
    onChange(option.value);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setHighlightedIndex(0);
    onSearch?.(term);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Label */}
      <label className={`block font-semibold text-gray-700 mb-2 ${isLarge ? 'text-lg' : 'text-sm'} ${isLarge ? 'uppercase tracking-wide' : ''}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchTerm : selectedLabel}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
            isLarge ? 'py-4 text-base' : 'text-sm'
          } ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
        />

        {/* Clear Button */}
        {clearable && value && !isOpen && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Selected Value Feedback */}
      {value && selectedLabel && !isOpen && (
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Selected: {selectedLabel}
        </p>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-[1000] max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              Loading...
            </div>
          ) : filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li key={`${option.value}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left px-4 py-2.5 transition-colors flex items-center gap-2 ${
                      index === highlightedIndex
                        ? 'bg-blue-500 text-white'
                        : value === option.value
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {value === option.value && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              No results found
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default CoreUISearchableSelect;
