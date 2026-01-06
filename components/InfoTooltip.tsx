import React from 'react';
import { Info } from 'lucide-react';

interface Props {
  text: string;
  size?: 'sm' | 'md';
}

const InfoTooltip: React.FC<Props> = ({ text, size = 'sm' }) => {
  return (
    <div className="group relative inline-flex items-center ml-1.5 cursor-help align-middle">
      <Info className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors`} />
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 dark:bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 text-center leading-normal">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-black"></div>
      </div>
    </div>
  );
};

export default InfoTooltip;