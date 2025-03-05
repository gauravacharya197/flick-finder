import React from 'react';
import { Button } from './primitives/button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    // Always show first and last page
    if (totalPages <= maxPagesToShow) {
      // If total pages are less, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic to show intelligent page number selection
      if (currentPage <= 3) {
        // Show first few pages
        pages.push(1, 2, 3, 4, totalPages);
      } else if (currentPage > totalPages - 3) {
        // Show last few pages
        pages.push(1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show current page and surrounding pages
        pages.push(
          1, 
          currentPage - 1, 
          currentPage, 
          currentPage + 1, 
          totalPages
        );
      }
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <FaChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={page}>
          {index > 0 && pageNumbers[index - 1] !== page - 1 && (
            <span className="text-muted-foreground">...</span>
          )}
          <Button
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
            className="h-8 w-8"
          >
            {page}
          </Button>
        </React.Fragment>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <FaChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;