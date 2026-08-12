import { useState, useMemo } from "react";
import './App.css'
import PreviewImage from "./components/PreviewImage";

import { FileUploader } from "react-drag-drop-files";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { SPRITE_COORDINATES as coordinates } from "./coordinates";

function App() {

   const [help, setHelp] = useState(false)
   const [files, setFiles] = useState([]);
   const [bitmaps, setBitmaps] = useState([])
   const [characterName, setCharacterName] = useState([])
   const [trainerCardSelection, setTrainerCardSelection] = useState([])
   const [bikeWalkingSelection, setBikeWalkingSelection] = useState([])

   const fileUrls = useMemo(() => files.map(file => URL.createObjectURL(file)), [files]);


   const namesCompleted = files.length > 0 && files.every((file, index) => {
      const name = characterName[index];
      return name !== undefined && name.trim().length > 0;
   });

   console.log(files, characterName, trainerCardSelection)

   async function handleChange(file) {

      const uploaded = Array.from(file)
      const newFiles = uploaded.filter((item) => files.every((f) => item.name != f.name))
      const validFiles = []
      const validBitmaps = []

      for (const file of newFiles) {
         const bitmap = await createImageBitmap(file)
         //allowed sizes
         if (bitmap.height === 300 && bitmap.width === 800) {
            validFiles.push(file)
            validBitmaps.push(bitmap)
         } else {
            bitmap.close()
         }
      }
      setBitmaps((prev) => [...prev, ...validBitmaps])

      setFiles([...files, ...validFiles]);
      setTrainerCardSelection((prev) => [...prev, ...validFiles.map(() => "trainer")])
      setBikeWalkingSelection((prev) => [...prev, ...validFiles.map(() => "walking")])
   };

   function handleNameChange(e, index) {
      const newName = [...characterName]
      newName[index] = e.target.value.trimStart()
      setCharacterName(newName)
   }

   function handleRadioTrainer(e, index) {
      const newRadioSelection = [...trainerCardSelection]
      newRadioSelection[index] = e.target.value
      setTrainerCardSelection(newRadioSelection)
   }

   function handleRadioBike(e, index) {
      const newRadioSelection = [...bikeWalkingSelection]
      newRadioSelection[index] = e.target.value
      setBikeWalkingSelection(newRadioSelection)
   }

   function handleClick() {
      createImages()
   }

   function handleDelete(index) {
      bitmaps[index].close()
      setBitmaps((prev) => prev.filter((bit, i) => i != index))
      setFiles((prev) => prev.filter((f, i) => i != index))
      setCharacterName((prev) => prev.filter((char, i) => i != index))
      setTrainerCardSelection((prev) => prev.filter((selection, i) => i != index))
      setBikeWalkingSelection((prev) => prev.filter((selection, i) => i != index))
   }

   function handleHelpBottom() {
      setHelp((prev) => !prev)
      window.scrollTo({
         top: 0,
         behavior: "smooth" // Das sorgt für das weiche, flüssige Scrollen!
      });
   }

   async function createImages() {

      const zip = new JSZip();
      const folder = zip.folder("extracted_sprites")

      const canvas = document.createElement("canvas")

      for (let i = 0; i < files.length; i++) {

         let spriteIndex = 0

         for (const sprite of coordinates) {
            const spriteID = sprite.id
            let variant = ""

            switch (spriteID) {
               case "overworld":
                  variant = ""
                  break
               case "trainercard_1":
                  if (trainerCardSelection[i] == "front") {
                     variant = "_front"
                  }
                  break
               case "trainercard_2":
                  if (trainerCardSelection[i] == "trainer") {
                     variant = "_front"
                  }
                  break
               case "back":
                  variant = "_back"
                  break
               case "fishing_front":
                  variant = "_fish_front"
                  break
               case "fishing_back":
                  variant = "_fish_back"
                  break
               case "fishing_side":
                  variant = "_fish_side"
                  break
            }

            canvas.width = sprite.width
            canvas.height = sprite.height

            const context = canvas.getContext("2d")

            context.drawImage(bitmaps[i],
               sprite.x, sprite.y, canvas.width, canvas.height,
               0, 0, canvas.width, canvas.height
            )

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let j = 0; j < data.length; j += 4) {
               if (data[j + 3] === 0) continue;

               const brightness = (data[j] + data[j + 1] + data[j + 2]) / 3;

               if (brightness < 64) {
                  data[j] = 0;
                  data[j + 1] = 0;
                  data[j + 2] = 0;
                  data[j + 3] = 255;
               } else if (brightness < 128) {
                  data[j] = 85;
                  data[j + 1] = 85;
                  data[j + 2] = 85;
                  data[j + 3] = 255;
               } else if (brightness < 192) {
                  data[j] = 170;
                  data[j + 1] = 170;
                  data[j + 2] = 170;
                  data[j + 3] = 255;
               } else {
                  data[j + 3] = 0;
               }
            }
            context.putImageData(imageData, 0, 0);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));

            folder.file(`${characterName[i].trimEnd().toLowerCase()}${variant}.png`, blob);

            if (spriteIndex === 3 && bikeWalkingSelection[i] == "walking") {
               folder.file(`${characterName[i].trimEnd().toLowerCase()}_bike.png`, blob)
            }

            spriteIndex++
         }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "sprites.zip");
   }

   return (
      <>
         <header className={`${help ? "darken" : ""}`}>
            <img
               src="logo3.png"
               className="logo"
            />
            <h1 className="heading">
               <span>Crystal Clear Sprite Sheet</span>
               <span>to Gen1recomp Converter</span>
               <span className="m-top highlight-4">(CCSS Converter)</span>
            </h1>
            <img
               src="logo.png"
               className="logo"
            />
         </header>

         <main>
            <div className="description-box">
               <div className={`description ${help ? "darken" : ""}`}>
                  <span>Converts Crystal Clear Sprite sheets to <span className="highlight-2">separate assets</span></span>
                  <br />
                  <div className="stretch">
                     <span className="highlight-3">for</span>
                     <span className="highlight-3">use</span>
                     <span className="highlight-3">with</span>
                     <span className="highlight-3">gen1recomp</span>
                  </div>
                  <div className="stretch">
                     <span >Download</span>
                     <span >Sprite sheets</span>
                     <span >from</span>
                     <span >sigkill</span>
                  </div>
                  <span>Click: <span className="public-template highlight-2">"USE PUBLIC TEMPLATE" ➡️</span></span>
                  <a href="https://inject.sigkill.tech/injector/sprite" target="_blank">Sprite Sheets Source</a>
               </div>
               <button className="help-button"
                  onClick={() => setHelp(!help)}>
                  {!help ? "HELP!" : "Hide Help"}
               </button>
            </div>
            {help ? <>
               <hr className="hr-help" />
               <div className="help-container">
                  <h1>Tutorial</h1>
                  <span>1. Go to <a href="https://inject.sigkill.tech/injector/sprite" target="_blank">inject.sigkill.tech/injector/sprite</a></span>
                  <span>2. Click on <span className="highlight-2">"USE PUBLIC TEMPLATE"</span></span>
                  <img src="tutorial.jpg" />
                  <span>3. Download any Sprite Sheet you like: <span className="highlight-2">Right-Click "save image as"</span></span>
                  <span className="highlight-4">The sprite sheet should look like this (800x300px)</span>

                  <img src="rick.png" />
                  <hr></hr>
                  <img src="tutorial3.jpg" />
                  <span>4. <span className="highlight-2">Upload the file</span> to Crystal Clear Sprite Sheet to Gen1recomp Converter</span>
                  <span>5. Enter a <span className="highlight-2">character name</span> and select which <span className="highlight-2">front sprite</span> you like best</span>
                  <span>6. Click <span className="highlight-2">Download</span></span>
                  <span>7. Add the .png files to the assets folder of <span className="highlight"><a href="https://github.com/on1san/otf-player-switcher/releases/latest" target="_blank">Custom Player Sprite Switcher</a></span></span>

                  <button className="help-button-bottom"
                     onClick={() => handleHelpBottom()}>
                     {!help ? "HELP!" : "Hide Help"}
                  </button>
               </div>
            </>
               :
               <div className="upload-container">
                  <FileUploader
                     multiple={true}
                     handleChange={handleChange}
                     name="file"
                  />
                  {files.length > 0 &&
                     <>
                        {files.map((file, index) =>
                           <PreviewImage
                              key={`${index}${file.name}`}
                              index={index}
                              fileUrls={fileUrls}
                              characterName={characterName[index]}
                              handleNameChange={handleNameChange}
                              trainerCardSelection={trainerCardSelection}
                              handleRadioTrainer={handleRadioTrainer}
                              handleRadioBike={handleRadioBike}
                              setTrainerCardSelection={setTrainerCardSelection}
                              handleDelete={handleDelete}
                              bikeWalkingSelection={bikeWalkingSelection}
                           />

                        )}

                        {namesCompleted
                           ?
                           <button
                              id="download-button"
                              onClick={() => handleClick()}
                           >
                              Download
                           </button>
                           :
                           <button id="input-a-name">
                              Input missing {files.length <= 1 ? "name" : "names"}
                           </button>
                        }
                        {/*<span className="sub-download-hint">
                        <span className="public-template highlight-2">Click: "USE PUBLIC TEMPLATE" ➡️</span>
                        <a href="https://inject.sigkill.tech/injector/sprite">Sprite Sheets Source</a>
                     </span>*/}
                     </>
                  }
               </div>}
            {/* <hr />
            <div className="description-detailed">
               <a href="https://inject.sigkill.tech/injector/sprite">Sprite Sheets Source</a>
               Click: "USE PUBLIC TEMPLATE"
               <hr />
               
               <span>Input: 800x300px Spritesheet</span>
               <span>Output: 30x30 </span>
               <span>Output: 720x30 </span>
               <span>Output: 60x40</span>
               <span>Output: 50x28</span>
               
            </div>*/}
         </main >
         <footer>The image files are not uploaded to any server. Everything runs in your browser locally. <br /><b>CCSS Converter 2026</b></footer>
      </>
   )
}

export default App
