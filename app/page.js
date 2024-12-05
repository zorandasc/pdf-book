"use client";
//DEFINISANO react-pdf DOKUMENTACIJOM
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import React, { useState, useRef } from "react";
import Image from "next/image";

//BIBLIOTEKA ZA FLIP BOOK ANIMACIJU
import HTMLFlipBook from "react-pageflip";

//BIBLIOTEKA ZA HANDLOVANJE PDF
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";

import dynamic from "next/dynamic"; // Import dynamic from Next.js
// Dynamically import PinchZoomPan with SSR disabled
//ODNOSNO IMPORTUJ PinchZoomPan KOMPONENTU SAMO U BROWSERU
const PinchZoomPan = dynamic(() => import("react-responsive-pinch-zoom-pan"), {
  ssr: false,
});

//NESTO DEFINISANO react-pdf DOKUMENTACIJOM
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const backgroundImage = "/back1.jpg";
//PDF
const samplePDF = "/zekicom.pdf";
//ICONICE
const magplus = "/magplus.svg";
const arrow = "/arrow.svg";

const width = 400;
const height = 600;

//JEDNA PDF STRANICA
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
  const [currentPage, setCurrentPage] = useState(0); // Track current page - SACUVAJ KLIKNUTU STRANICU
  const flipBookRef = useRef(null); // Ref to access the FlipBook component

  //ULAZ U ZOOM MODE
  const handleEnterZoomMode = () => {
    setIsZoomMode(true);
  };

  //IZLAZ IZ ZOOM MODA
  const handleExitZoomMode = () => {
    setIsZoomMode(false);
    if (flipBookRef.current) {
      //KAD SE VRATIS IZ PINCHZOOMA VRATI flipBook TREBA DA POCNE OD KLIKNUTOG PAGEA
      flipBookRef.current.pageFlip().flip(currentPage); // Flip to the correct page
    }
  };

  //SVAKI PUT KAD KLIKNES PDF STRANICU SACUVAJ BROJ STRANICE U STATE
  const handlePageFlip = (e) => {
    setCurrentPage(e.data); // `e.data` contains the current page index
    console.log("Current Page:", e.data);
  };

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
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* FlipBook Component - KOMPONENTA SA SVIM PDF STRANICAMA*/}
        <div
          style={{
            visibility: isZoomMode ? "hidden" : "visible", // Hide FlipBook visually WITH CSS
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: isZoomMode ? 0 : 1,
            transition: "visibility 0s, z-index 0s", // No visual jump
          }}
        >
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

        {/* PinchZoomPan Component KOMPONENTA SAMO SA ZUMIRANOM STRANICOM*/}
        <div
          style={{
            visibility: isZoomMode ? "visible" : "hidden", // Hide PinchZoomPan visually
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: isZoomMode ? 1 : 0,
            width: "100%",
            height: "100%",
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
              background: "transparent",
            }}
          >
            <div>
              <Document file={samplePDF}>
                <Page pageNumber={currentPage + 1} />
              </Document>
            </div>
          </PinchZoomPan>
        </div>
      </div>
      {/* Zoom Toggle Buttons */}
      <div
        style={{
          marginBottom: "10px",
          position: "absolute",
          bottom: "40px",
          right: "10px",
          zIndex: "1001",
        }}
      >
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
            style={{
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#D2D3CE",
              letterSpacing:"1px",
              fontWeight:"bold"
            }}
          >
            Nastavi{" "}
            <Image
              alt="zoom"
              width={50}
              height={50}
              src={arrow}
              style={{ marginLeft: "4px" }}
            ></Image>
          </button>
        )}
      </div>
    </div>
  );
};

Home.displayName = "Home";

export default Home;
