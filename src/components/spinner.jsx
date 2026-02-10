import React from 'react';

const Spinner = () => {
    return (
        <div className="flex items-center justify-center py-20">
            <div role="status" className="relative">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-cecefb rounded-full animate-spin animation-delay-150"></div>
                <div className="absolute inset-2 w-8 h-8 border-4 border-transparent border-t-white/50 rounded-full animate-spin animation-delay-300"></div>
                <span className="sr-only">Loading movies...</span>
            </div>
        </div>
    );
}

export default Spinner;
