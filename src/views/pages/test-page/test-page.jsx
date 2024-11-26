import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import Selector from "../../../components/beginSelector/beginSelector"
export default function Testpage() {
    return(
        <div>
            <h1>Test Page</h1>
            <Selector/>
        </div>
    )
}