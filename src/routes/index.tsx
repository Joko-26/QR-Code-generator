import { createFileRoute } from "@tanstack/react-router"
import "../App.css";
import { QRCodeSVG } from "qrcode.react";
import { useState, useRef } from "react";
import { Helmet } from "react-helmet";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [qrurl, setqrUrl] = useState<string>("");
  const [bgcolor, setBgcolor] = useState<string>("#ffffff");
  const [color, setColor] = useState<string>("#000000");
  const [size, setSize] = useState<number>(128);

  const [centerImg, setCenterImg] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCenterImg(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <Helmet>
        <title>QR-Code Generator</title>
        <meta name="description" content="Erstelle kostenlos QR-Codes mit eigenem Logo und Farben." />
      </Helmet>

      <h1>Create your QR-Codes for free</h1>
      <div className="form_container">
        <div>
          <input
            type="text"
            placeholder="URL"
            value={qrurl}
            onChange={(e) => setqrUrl(e.target.value)}
          />

          <div className="input_type_container">
            <p>QR-Code color</p>
            <input
              type="color"
              name=""
              value={color}
              id=""
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="input_type_container">
            <p>Background color</p>
            <input
              type="color"
              value={bgcolor}
              name=""
              id=""
              onChange={(e) => setBgcolor(e.target.value)}
            />
          </div>

          <div className="input_type_container">
            <p>Size</p>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value={64}>64 px</option>
              <option value={128}>128 px</option>
              <option value={256}>256 px</option>
              <option value={348}>348 px</option>
              <option value={512}>512 px</option>
            </select>
          </div>

          <div className="input_type_container">
            <p>Center Image</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button
              onClick={() => setCenterImg(null)}>delete image</button>
          </div>
        </div>

          <button className="download_button" onClick={handleDownload}>
            download QR-Code
          </button>
      </div>

      <div className="QR-code">
        <QRCodeSVG
          ref={svgRef}
          value={qrurl}
          bgColor={bgcolor}
          fgColor={color}
          size={size}
          imageSettings={
            centerImg
              ? {
                  src: centerImg,
                  height: size * 0.3,
                  width: size * 0.3,
                  excavate: true,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
