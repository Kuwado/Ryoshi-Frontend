import React from "react";
import "./index.css";

export default function Button({ label, className, type, onClick }) {
    return(
        <button 
        className={`custom-button ${className}`}
        type={type} 
        onClick={onClick}>
            {label}
        </button>
    )
}