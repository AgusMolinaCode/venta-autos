import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Context to pass handleSelectOption to children
const EditableSelectContext = createContext<((value: string) => void) | null>(null);

interface EditableSelectProps {
  value: string;
  onChange: (value: string) => void;
  onRefetch?: () => void;
  placeholder?: string;
  loading?: boolean;
  loadingText?: string;
  refetchText?: string;
  children?: React.ReactNode;
  className?: string;
  onOptionSelect?: (value: string) => void; // Callback for when option is selected
}

export function EditableSelect({
  value,
  onChange,
  onRefetch,
  placeholder = "Seleccionar...",
  loading = false,
  loadingText = "Cargando...",
  refetchText = "🔄 Actualizar datos",
  children,
  className,
  onOptionSelect
}: EditableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Update form value when losing focus
        if (inputValue !== value) {
          onChange(inputValue);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue, value, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
      onChange(inputValue);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setInputValue(value);
    } else if (e.key === 'ArrowDown') {
      setIsOpen(true);
    }
  };

  const handleSelectOption = (selectedValue: string) => {
    if (selectedValue === '__refetch__') {
      onRefetch?.();
      return;
    }
    
    setInputValue(selectedValue);
    onChange(selectedValue);
    onOptionSelect?.(selectedValue); // Call the external callback
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <FormControl>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onClick={() => setIsOpen(!isOpen)}
            placeholder={placeholder}
            className={cn(
              "pr-10 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white",
              className
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            )}
          </Button>
        </div>
      </FormControl>

      {/* Dropdown Options */}
      {isOpen && (
        <EditableSelectContext.Provider value={handleSelectOption}>
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-3 text-sm text-gray-500 dark:text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {loadingText}
              </div>
            )}
            
            {!loading && children}
            
            {/* Always show refetch option at the bottom */}
            {!loading && onRefetch && (
              <>
                <div className="border-t border-gray-200 dark:border-zinc-600 my-1" />
                <button
                  type="button"
                  onClick={() => handleSelectOption('__refetch__')}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                >
                  {refetchText}
                </button>
              </>
            )}
          </div>
        </EditableSelectContext.Provider>
      )}
    </div>
  );
}

// Option component for use within EditableSelect
interface EditableSelectOptionProps {
  value: string;
  onSelect?: (value: string) => void; // Optional external callback
  children: React.ReactNode;
  className?: string;
}

export function EditableSelectOption({ 
  value, 
  onSelect, 
  children, 
  className 
}: EditableSelectOptionProps) {
  const contextSelectHandler = useContext(EditableSelectContext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Call external callback first (ModelSelector/YearSelector logic)
    onSelect?.(value);
    
    // Then call context handler (EditableSelect internal logic + close dropdown)
    contextSelectHandler?.(value);
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700",
        className
      )}
    >
      {children}
    </button>
  );
}