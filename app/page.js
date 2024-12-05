"use client";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import React, { useState, useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
import PinchZoomPan from "react-responsive-pinch-zoom-pan";
import Image from "next/image";

const backgroundImage = "/back1.jpg";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const samplePDF = "/zekicom.pdf";
const magplus = "/magplus.svg";
const magminus = "/magminus.svg";
const width = 400;
const height = 600;

const Page = React.forwardRef(({ pageNumber }, ref) => {
  return (
    <div ref={ref} style={{ marginBottom: "10px" }}>
      <ReactPdfPage pageNumber={pageNumber} width={width} />
    </div>
  );
});

Page.displayName = "Page";

const Home = () => {
  const [isZoomMode, setIsZoomMode] = useState(false); // Toggle zoom mode
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const flipBookRef = useRef(null); // Ref to access the FlipBook component

  const handleEnterZoomMode = () => {
    setIsZoomMode(true);
  };

  const handleExitZoomMode = () => {
    setIsZoomMode(false);
  };

  const handlePageFlip = (e) => {
    setCurrentPage(e.data); // `e.data` contains the current page index
    console.log("Current Page:", e.data);
  };

  // Use useEffect to flip the page when exiting zoom mode
  useEffect(() => {
    if (!isZoomMode && flipBookRef.current) {
      // Ensure the FlipBook flips to the correct page when zoom mode is exited
      flipBookRef.current.pageFlip().flip(currentPage);
    }
  }, [isZoomMode, currentPage]);

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
        margin: "0 auto",
        overflow: "hidden"
      }}
    >
      {/* Zoom Toggle Buttons */}
      <div style={{ marginBottom: "20px" }}>
      {!isZoomMode ? (
          <button
            onClick={handleEnterZoomMode}
            style={{
              marginRight: "10px",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <Image alt="zoom" width={50} height={50} src={magplus}></Image>
          </button>
        ) : (
          <button
            onClick={handleExitZoomMode}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <Image alt="zoom" width={50} height={50} src={magminus}></Image>
          </button>
        )}
      </div>

      {/* FlipBook or Pinch-to-Zoom Mode */}
      {!isZoomMode ? (
        <div>
          <Document file={samplePDF}>
            <HTMLFlipBook
              width={width}
              height={height}
              showCover={true}
              onFlip={handlePageFlip}
              ref={flipBookRef} // Attach the ref to the FlipBook component
            >
              {[...Array(22)].map((_, i) => (
                <Page key={i} pageNumber={i + 1} />
              ))}
            </HTMLFlipBook>
          </Document>
        </div>
      ) : (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            overflow: "hidden",
          }}
        >
          <PinchZoomPan
            minScale={1}
            maxScale={3}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
            }}
          >
            <div>
              <Document file={samplePDF}>
                <Page pageNumber={currentPage + 1} />
              </Document>
            </div>
          </PinchZoomPan>
        </div>
      )}
    </div>
  );
};

Home.displayName = "Home";

export default Home;
