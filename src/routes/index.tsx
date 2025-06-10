import { createFileRoute } from "@tanstack/react-router"
import "../App.css";
import { QRCodeSVG } from "qrcode.react";
import { useState, useRef, useEffect } from "react";
import Helmet  from 'react-helmet';

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  // create needed variables
  const [qrurl, setqrUrl] = useState<string>("");
  const [bgcolor, setBgcolor] = useState<string>("#ffffff");
  const [color, setColor] = useState<string>("#000000");
  const [size, setSize] = useState<number>(128);
  const [bgTransparent, setBgTransparent] = useState<boolean>(false)
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('L');


  const [centerImg, setCenterImg] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (centerImg) {
      setErrorCorrection("H");
    } else {
      setErrorCorrection("L");
    }
  }, [centerImg]);


  // function tha handles the image upload (gets called from the center image input)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // gets the file 
    const file = e.target.files?.[0];
    // checks if  an file is selected to upload exists if not the funktion stops
    if (!file) return;
    // initialises an file reader object to read the file
    const reader = new FileReader();
    // defines what happens if the reading of the file is complete
    reader.onload = (ev) => {
      // converts the read file to an data URL and puts it in the centerImg variable
      setCenterImg(ev.target?.result as string);
    };
    // starts the reading of the file 
    reader.readAsDataURL(file);

    
  };

  // function that makes the background transparent according to the input
  const transparentBG = (checked:boolean) => {
    // if checked is true make the background transparent
    if (checked) {
      setBgcolor("#00000000")
      setBgTransparent(true)
      // if not make it white
    } else {
      setBgcolor("#FFFFFF")
      setBgTransparent(false)
    }
  }


  // function tha handles the QR-Code download as SVG (gets called by the download QR-Code SVG button)
  const handleDownloadSVG = () => {
    // gets the image
    const svg = svgRef.current;
    // checks if there is an QR-code to download if not the function stops
    if (!svg) return;

    // creates an temporary url for the image:
    // creates an XMLSerializer to transform the image to an string 
    const serializer = new XMLSerializer();
    // transforms the image to an SVG-XML-Element
    const source = serializer.serializeToString(svg);
    // creates an blob from the SVG-String 
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    // creates an temporary url for the blob
    const url = URL.createObjectURL(blob);

    // creates an invisible link element and sets its parameters
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.svg";

    // adds the link to the page
    document.body.appendChild(link);
    // simulates an click on the link 
    link.click();
    // deletes the link from the page
    document.body.removeChild(link);
    // kills the URL
    URL.revokeObjectURL(url);
  };

  // function tha handles the QR-Code download as PNG (gets called by the download QR-Code PNG button)
  const handleDownloadPNG = () => {
    // gets the image
    const svg = svgRef.current;
    // checks if there is an QR-code to download if not the function stops
    if (!svg) return;
    
    // creates an temporary url for the image:
    // creates an XMLSerializer to transform the image to an string 
    const serializer = new XMLSerializer();
    // transforms the image to an SVG-XML-Element
    const source = serializer.serializeToString(svg);

    // encrypts the SVG-XML-Element into Base64
    const svg64 = btoa(unescape(encodeURIComponent(source)));
    // creates an data url from the Base64 element
    const image64 = 'data:image/svg+xml;base64,' + svg64;
    
    // creates an new image element (img)
    const img = new window.Image();
    // when the image finished loading it executes following code
    img.onload = function () {
      // creates an new canvas element with the selected size
      const canvas = document.createElement('canvas');
      canvas.width = svg.width.baseVal.value || size;
      canvas.height = svg.height.baseVal.value || size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // sets the background to the selected color
      ctx.fillStyle = bgcolor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // converts the canvas element into an invisible png link
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'qrcode.png';
      // adds the link to the page
      document.body.appendChild(link);
      // simulates an click on the link
      link.click();
      // deletes the link from the page
      document.body.removeChild(link);
    };
    img.src = image64;
  };

  return (
    <div>
      <div className="App">
        {/* site meta data */}
        <Helmet>
          <title>QR-Code Generator</title>
          <meta name="description" content="Erstelle kostenlos QR-Codes mit eigenem Logo und Farben." />
        </Helmet>
        {/*Headline*/}
        <h1>Create your QR-Codes for free</h1>
        {/* container or all inputs and buttons*/}
        <div className="form_container">
          <div>
            {/* URL input field*/}
            <input
              type="text"
              placeholder="URL"
              value={qrurl}
              onChange={(e) => setqrUrl(e.target.value)}
            />

            {/* QR-Code color input*/}
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

            {/* Background color input*/}
            <div className="input_type_container">
              <p>Background color</p>
              <input
                type="color"
                value={bgcolor}
                name=""
                id=""
                onChange={(e) => setBgcolor(e.target.value)}
              />
              {/* option to make the background transparent*/}
              <p>Transparent background:</p>
              <input className="checkbox" type="checkbox" name="bg-transparent" id="" checked={bgTransparent} onChange={(e) => transparentBG(e.target.checked)} />
            </div>

            {/* QR-Code size selection*/}
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

            {/* Center image upload input*/}
            <div className="input_type_container">
              <p>Center Image</p>
              <input type="file" accept="image/*" onChange={e => {handleImageUpload(e)}} />
              <button
                onClick={() => setCenterImg(null)}>delete image</button>
            </div>
          </div>

            {/* QR-Code Download button*/}
            <button className="download_button" onClick={handleDownloadSVG}>
              download QR-Code as SVG
            </button>
            <button className="download_button" onClick={handleDownloadPNG}>
              download QR-Code as PNG
            </button>
        </div>

        {/*QR-Code*/}
        <div className="QR-code">
          <QRCodeSVG
            ref={svgRef}
            value={qrurl}
            bgColor={bgcolor}
            fgColor={color}
            size={size}
            level={errorCorrection}
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
      <div className="see-more-container">
        <h3>If you liked this tool and want to see more:</h3>
        <div>
          <a className="play-button"  href="https://orosemo.de/">My Website</a>
          <a className="play-button" href="https://github.com/Joko-26">My Github</a>
        </div>

      </div>
    </div>

  );
}
