import React from 'react';

function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
      <div className="relative flex items-center justify-center">
        {/* Orange Circle */}
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-customColor1"></div>
          {/* Green Circle spinning backwards */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spinBackward rounded-full h-24 w-24 border-t-4 border-b-4 border-customColor4 opacity-75"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
