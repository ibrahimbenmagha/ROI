import React from 'react';

interface HeadProps {
  title: string;
  subtitle?: string;
}

const Head: React.FC<HeadProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
};

export default Head;