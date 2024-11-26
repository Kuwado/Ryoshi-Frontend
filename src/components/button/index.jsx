import React from "react";

export default function Button({ label, className, onClick }) {
    return(
        <div class="button-wrapper">
        <input type="checkbox" id="button" class="d-none" />
        <label
            htmlFor={label} 
            for="button" 
            className={`btn d-flex align-items-center justify-content-center ${className}`}
            onClick={onClick}>
                {label}
        </label>
      </div>
    )
}