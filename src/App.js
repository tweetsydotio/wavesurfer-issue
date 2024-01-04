import React from "react";
import "./styles.css";
import { Link, Route, Routes } from "react-router-dom";
import WSVis from "./WSVis";
import Second from "./Second";
import Three from "./Three";
import PWS from "./PWS";
import AudioPlayer from "./pws_region";

function App() {
  return (
    <>
      <ul>
        {/* <li>
          <Link to={`/`}>Home</Link>
        </li> */}
        <li>
          <Link to={`/region`}>Region</Link>
        </li>
        <li>
          <Link to={`/pws`}>PWS</Link>
        </li>
        <li>
          <Link to={`/2nd`}>2nd</Link>
        </li>
        <li>
          <Link to={`/3rd`}>3nd</Link>
        </li>
      </ul>
      <Routes>
        {/* <Route path="/" element={<WSVis />} /> */}
        <Route path="/region" element={<AudioPlayer />} />
        <Route path="/pws" element={<PWS />} />
        <Route path="/2nd" element={<Second />} />
        <Route path="/3rd" element={<Three />} />
      </Routes>
    </>
  );
}
export default App;
