import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import Button from "../../../components/button";

export default function Testpage() {
    return(
        <div>
            <h1>Test Page</h1>
            <Button label="Click me"
            className=""
            onClick={() => alert("Button clicked")} />  
        </div>
    )
}