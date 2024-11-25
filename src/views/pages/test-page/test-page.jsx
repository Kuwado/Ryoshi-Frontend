import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../../components/header";
import Footer from "../../../components/footer";

export default function Testpage() {
    return(
        <div>
            <Header />
            <h1>Test Page</h1>
            <Footer />  
        </div>
    )
}