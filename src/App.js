import React from "react";
import "./styles.css";
import { Link, Route, Routes } from "react-router-dom";
import WSVis from "./WSVis";
import Second from "./Second";
import Three from "./Three";

function App() {
  return (
    <>
      <ul>
        <li>
          <Link to={`/`}>Home</Link>
        </li>
        <li>
          <Link to={`/2nd`}>2nd</Link>
        </li>
        <li>
          <Link to={`/3rd`}>2nd</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<WSVis />} />
        <Route path="/2nd" element={<Second />} />
        <Route path="/3rd" element={<Three />} />
      </Routes>
    </>
  );
}
export default App;
