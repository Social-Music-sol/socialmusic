import React from 'react';

function UIComponent(props) {
  const handleChange = (event) => {
    props.onColorChange(event.target.value);
  };

  return (
    <div>
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
