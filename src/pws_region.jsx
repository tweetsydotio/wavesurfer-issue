import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
const random = (min, max) => Math.random() * (max - min) + min;

const randomColor = () =>
  `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;

const AudioPlayer = () => {
  const waveformRef = useRef(null);
  const regionRef = useRef(null);
  const timelineRef = useRef(null);
  const fullTimelineRef = useRef(null);
  const minimapRef = useRef(null);

  useEffect(() => {
    fullTimelineRef.current = TimelinePlugin.create({
      container: timelineRef.current,
    });
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      height: 70,
      waveColor: "rgb(0, 0, 0)",
      progressColor: "rgb(100, 0, 100)",
      background: "rgb(100, 0, 100)",
      borderRadius: 10,
      minPxPerSec: 50,
      //   url: "https://res.cloudinary.com/dizyugwtg/video/upload/v1702208850/ommzjn6bhlvd7hlg9ro0.mp3",
      // url: "https://res.cloudinary.com/dizyugwtg/video/upload/v1702208258/kstf8sd6bbakvajinku7.mp3",
      // url: `/examples/audio/bensound-ukulele.mp3`,
      plugins: [
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
        fullTimelineRef.current,
      ],
      barWidth: 2,
      // Optionally, specify the spacing between bars
      barGap: 1,
      // And the bar radius
      barRadius: 2,
    });

    const wsRegions = ws.registerPlugin(
      RegionsPlugin.create({ container: "#region_container" })
    );

    ws.load(`https://res.cloudinary.com/demo/video/upload/dog.mp3`); //`/examples/audio/bensound-ukulele.mp3`
    ws.on("decode", () => {});
    ws.on("ready", () => {
      wsRegions.addRegion({
        start: 0,
        end: 15,
        // content: "Resize me",
        color: randomColor(),
        drag: true,
        // resize: true,
        minLength: 10,
        maxLength: 59,
        height: "50px",
      });
      wsRegions.addRegion({
        start: 5,
        // content: "Marker",
        content: "⚜️",
        color: randomColor(),
      });
      wsRegions.addRegion({
        start: 10,
        // content: "Second marker",
        color: randomColor(),
      });
    });
    // wsRegions.enableDragSelection({
    //   color: "red",
    //   // color: "rgba(255, 0, 0, 0.1)",
    // });

    wsRegions.on("region-updated", (region) => {
      // console.log("Updated region", region);
      console.log(
        wsRegions?.drawer?.container?.style?.height,
        "==========================",
        region.getHeight
      );
    });

    let loop = true;

    document.querySelector('input[type="checkbox"]').onclick = (e) => {
      loop = e.target.checked;
    };

    let activeRegion = null;

    wsRegions.on("region-in", (region) => {
      console.log("region-in", region);
      activeRegion = region;
    });

    wsRegions.on("region-out", (region) => {
      console.log("region-out", region);
      if (activeRegion === region) {
        if (loop) {
          region.play();
        } else {
          activeRegion = null;
        }
      }
    });

    wsRegions.on("region-clicked", (region, e) => {
      e.stopPropagation();
      activeRegion = region;
      region.play();
      region.setOptions({ color: randomColor() });
    });

    ws.on("interaction", () => {
      activeRegion = null;
    });

    ws.once("decode", () => {
      document.querySelector('input[type="range"]').oninput = (e) => {
        const minPxPerSec = Number(e.target.value);
        console.log({ minPxPerSec });
        ws.zoom(minPxPerSec);
      };
    });

    // console.log(waveformRef.current.childNodes[1]);
    const shadowElement =
      waveformRef.current.shadowRoot?.querySelector("shadow-root");
    console.log(shadowElement);
    // Cleanup function
    return () => {
      ws.destroy();
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <div id="minimap_container" ref={minimapRef}></div>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero in
      assumenda quos ullam. Non numquam animi, rerum dolore nam, vero, error
      libero aliquam repellat dolor enim culpa maiores laborum nihil!
      <div>
        <div
          ref={waveformRef}
          id="waveform_container"
          className="bg-dark"
          style={{
            // position: "relative",
            // background: `rgba(0,0,0,0.3)`,
            // borderRadius: "5px",
          }}
        >
          <div id="region_container" ref={regionRef} />
        </div>
      </div>
      <div ref={timelineRef} id="timeline_container" />
      <input type="checkbox" /> Loop
      <input type="range" max={1000} min={0} />
    </div>
  );
};

export default AudioPlayer;
