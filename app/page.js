"use client";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";

const backgroundImage = "/back1.jpg";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const samplePDF = "/zekico.pdf";
const width = 400;
const height = 600;

const Page = React.forwardRef(({ pageNumber }, ref) => {
  return (
    <div ref={ref}>
      <ReactPdfPage pageNumber={pageNumber} width={width} />
    </div>
  );
});

Page.displayName = "Page";

const Home = () => {
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom level state

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2)); // Max zoom
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // Prevent overflow when zoomed
      }}
    >
      {/* Zoom Controls */}
      <div style={{ marginBottom: "20px",zIndex:"1000" }}>
        <button onClick={handleZoomIn} style={{ marginRight: "10px" }}>
          Zoom In
        </button>
        <button onClick={handleZoomOut} style={{ marginRight: "10px" }}>
          Zoom Out
        </button>
        <button onClick={handleResetZoom}>Reset Zoom</button>
      </div>

      {/* Flipbook with Zoom */}
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center", // Zoom from the center
          transition: "transform 0.3s ease", // Smooth zoom
        }}
      >
        <Document file={samplePDF}>
          <HTMLFlipBook width={width} height={height} showCover={true}>
            {/* Add pages dynamically based on the number of pages in your PDF */}
            {[...Array(21)].map((_, i) => (
              <Page key={i} pageNumber={i + 1} />
            ))}
          </HTMLFlipBook>
        </Document>
      </div>
    </div>
  );
};

Home.displayName = "Home";

export default Home;
