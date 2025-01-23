import React, { useState } from 'react';

const TestComponent = () => {
  const [bgColor, setBgColor] = useState('#ffffff'); // Default background color

  const handleColorChange = (e:any) => {
    setBgColor(e.target.value);
  };

  const handleHexInputChange = (e:any) => {
    const newColor = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      setBgColor(newColor);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center space-x-6 bg-gray-100">
      <div
        className=" flex items-center justify-center text-black font-bold"
        style={{ backgroundColor: bgColor }}
      >
        TEST
      </div>
      <input
        type="color"
        value={bgColor}
        onChange={handleColorChange}
        className=" border rounded"
      />
      <input
        type="text"
        value={bgColor}
        onChange={handleHexInputChange}
        className="border rounded"
      />
    </div>
  );
};

export default TestComponent;