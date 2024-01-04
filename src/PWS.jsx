// React example
// See https://github.com/katspaugh/wavesurfer-react

import * as React from "react";
const { useMemo, useState, useCallback, useRef } = React;
import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";

const audioUrls = [
  "/examples/audio/bensound-ukulele.mp3",
  "https://res.cloudinary.com/dizyugwtg/video/upload/v1702208850/ommzjn6bhlvd7hlg9ro0.mp3",
  `https://res.cloudinary.com/demo/video/upload/dog.mp3`,
  //   "/examples/audio/stereo.mp3",
  //   "/examples/audio/mono.mp3",
  //   "/examples/audio/librivox.mp3",
];

const formatTime = (seconds) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

// A React component that will render wavesurfer
const PWS = () => {
  const containerRef = useRef(null);
  const [urlIndex, setUrlIndex] = useState(0);
  // Initialize the Regions plugin

  // Give regions a random color when they are created
  const random = (min, max) => Math.random() * (max - min) + min;
  const randomColor = () =>
    `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;
  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 70,
    waveColor: "rgba(0, 0, 0,0.9)",
    progressColor: "rgb(100, 0, 100)",
    // url: audioUrls[urlIndex],
    plugins: useMemo(
      () => [
        Timeline.create({
          container: `#timeline-container`,
        }),
        Minimap.create({
          container: "#minimap_container",
          height: 30,
          waveColor: "#009dea",
          progressColor: "#009dea",
          barWidth: 2,
          // Optionally, specify the spacing between bars
          barGap: 1,
          // And the bar radius
          barRadius: 2,
          // the Minimap takes all the same options as the WaveSurfer itself
        }),
      ],
      []
    ),

    // onReady: (ws) => {
    // Add the region when the wavesurfer instance is ready
    //   ws.addRegion({
    //     start: 0,
    //     end: 8,
    //     content: "Resize me",
    //     color: "red",
    //     drag: true,
    //     resize: true,
    //   });
    //   console.log(ws);
    // },

    // Set a bar width
    barWidth: 2,
    // Optionally, specify the spacing between bars
    barGap: 1,
    // And the bar radius
    barRadius: 2,
  });
  React.useEffect(() => {
    if (wavesurfer) {
      wavesurfer.load(audioUrls[urlIndex]);
      const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());
      wavesurfer.on("ready", () => {
        wsRegions.addRegion({
          start: 0,
          end: 15,
          // content: "Resize me",
          color: randomColor(),
          drag: true,
          // resize: true,
          minLength: 10,
          maxLength: 59,
        });
      });
      // wavesurfer.on("decode", () => {
      //   wsRegions.addRegion({
      //     start: 0,
      //     end: 15,
      //     // content: "Resize me",
      //     color: randomColor(),
      //     drag: true,
      //     // resize: true,
      //     minLength: 10,
      //     maxLength: 59,
      //   });
      // });
      wavesurfer.once("decode", () => {
        document.querySelector('input[type="range"]').oninput = (e) => {
          const minPxPerSec = Number(e.target.value);
          console.log({ minPxPerSec });
          wavesurfer.zoom(minPxPerSec);
        };
      });
    }
  }, [wavesurfer, urlIndex]);
  //   const wsRegions = registerPlugin(RegionsPlugin.create());
  const onUrlChange = useCallback(() => {
    setUrlIndex((index) => (index + 1) % audioUrls.length);
  }, []);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <>
      <div id="minimap_container" />
      <div ref={containerRef} id="waveform_container" />
      <div id="timeline-container" />
      <div id="region-container" />
      <p>Current audio: {audioUrls[urlIndex]}</p>

      <p>Current time: {formatTime(currentTime)}</p>

      <div style={{ margin: "1em 0", display: "flex", gap: "1em" }}>
        <button onClick={onUrlChange}>Change audio</button>

        <button onClick={onPlayPause} style={{ minWidth: "5em" }}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <input type="range" max={1000} min={0} />
    </>
  );
};

export default PWS;
