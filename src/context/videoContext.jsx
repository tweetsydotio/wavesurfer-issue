/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React from "react";

const initialState = {
  // from_audio: "", //userUploaded or prodcastAPI,
};

export const ACTIONS = {
  TITLE: "TITLE",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.TITLE:
      return {
        ...state,
        title: action?.payload,
      };

    default:
      return state;
  }
}

export const VideoContext = React.createContext({});

const VideoProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const wavesurferRef = React.useRef();
  const [regionsVis, setRegionsVis] = React.useState(true);

  // control wavesurfer region
  return (
    <VideoContext.Provider value={{ wavesurferRef, regionsVis, setRegionsVis }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoProvider;

export const useVideo = () => React.useContext(VideoContext);
