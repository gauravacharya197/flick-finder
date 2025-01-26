// SectionHeader.tsx
import React from 'react';

interface SectionHeaderProps {
  className?: string;
  text: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ className, text }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-6 w-1.5 bg-primary"></div>
      <h3 className="text-2xl font-semibold">{text}</h3>
    </div>
  );
};

export default SectionHeader;