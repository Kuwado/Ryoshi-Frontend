import React, { useState } from "react";
import "./chip.css";

const Chip = ({ label = "Example Chips", id = "chips", onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <section className="mb-4">
      <div className="chips-wrapper">
        <input
          type="checkbox"
          id={id}
          className="d-none"
          checked={checked}
          onChange={handleChange}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    </section>
  );
};

export default Chip;
