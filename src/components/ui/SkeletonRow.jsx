import React from 'react';

const SkeletonRow = () => (
  <div className="row-scroll">
    {Array.from({ length: 8 }).map((_, index) => <div key={index} className="skeleton-card" />)}
  </div>
);

export default SkeletonRow;
