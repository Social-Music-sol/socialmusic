import React from 'react';

function UIComponent(props) {
  const handleChange = (event) => {
    props.onColorChange(event.target.value);
  };

  return (
    <div className="color-picker-container">
      <label htmlFor="colorPicker">Choose a color:</label>
      <input
        type="color"
        id="colorPicker"
        onChange={handleChange}
      />
    </div>
  );
}

export default UIComponent;
