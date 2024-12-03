"use client";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import React from "react";
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

const Home = () => {
  return (
    <div
      style={{
        // use the src property of the image object
        backgroundImage: `url(${backgroundImage})`,
        // other styles
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Document file={samplePDF}>
        <HTMLFlipBook width={width} height={height} showCover={true}>
          <Page pageNumber={1} />
          <Page pageNumber={2} />
          <Page pageNumber={3} />
          <Page pageNumber={4} />
          <Page pageNumber={5} />
          <Page pageNumber={6} />
          <Page pageNumber={7} />
          <Page pageNumber={8} />
          <Page pageNumber={9} />
          <Page pageNumber={10} />
        </HTMLFlipBook>
      </Document>
    </div>
  );
};

Home.displayName = "Home";

export default Home;
