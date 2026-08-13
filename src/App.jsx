import { useState, useMemo } from "react"
import './App.css'
import PreviewImage from "./components/PreviewImage"
import Help from "./components/Help"

import { convertToPalette } from "./utils"

import { FileUploader } from "react-drag-drop-files"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { SPRITE_COORDINATES as coordinates } from "./coordinates"

function App() {

   const [help, setHelp] = useState(false)
   const [files, setFiles] = useState([])
   const [fileUrls, setFileUrls] = useState([])
   const [bitmaps, setBitmaps] = useState([])
   const [characterName, setCharacterName] = useState([])
   const [trainerCardSelection, setTrainerCardSelection] = useState([])
   const [bikeWalkingSelection, setBikeWalkingSelection] = useState([])

   const namesCompleted = useMemo(() => {
      return files.length > 0 && files.every((file, index) => {
         const name = characterName[index]
         return name !== undefined && name.trim().length > 0
      })
   }, [files, characterName])

   console.log(files, characterName, trainerCardSelection)

   async function handleChange(file) {

      const uploaded = Array.from(file)
      const newFiles = uploaded.filter((item) => files.every((f) => item.name != f.name))
      const validFiles = []
      const validBitmaps = []
      const validUrls = []

      for (const file of newFiles) {
         const bitmap = await createImageBitmap(file)
         //allowed sizes
         if (bitmap.height === 300 && bitmap.width === 800) {
            validFiles.push(file)
            validBitmaps.push(bitmap)
            validUrls.push(URL.createObjectURL(file))
         } else {
            bitmap.close()
         }
      }
      setBitmaps((prev) => [...prev, ...validBitmaps])

      setFiles([...files, ...validFiles])
      setFileUrls((prev) => [...prev, ...validUrls])

      setTrainerCardSelection((prev) => [...prev, ...validFiles.map(() => "trainer")])
      setBikeWalkingSelection((prev) => [...prev, ...validFiles.map(() => "walking")])
   }

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
      URL.revokeObjectURL(fileUrls[index])

      setBitmaps((prev) => prev.filter((bit, i) => i != index))
      setFiles((prev) => prev.filter((f, i) => i != index))
      setFileUrls((prev) => prev.filter((url, i) => i != index))

      setCharacterName((prev) => prev.filter((char, i) => i != index))
      setTrainerCardSelection((prev) => prev.filter((selection, i) => i != index))
      setBikeWalkingSelection((prev) => prev.filter((selection, i) => i != index))
   }

   function handleHelpBottom() {
      setHelp((prev) => !prev)
      window.scrollTo({
         top: 0,
         behavior: "smooth"
      })
   }

   async function createImages() {

      const zip = new JSZip()
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

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

            convertToPalette(imageData.data)

            context.putImageData(imageData, 0, 0)

            const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"))

            folder.file(`${characterName[i].trimEnd().toLowerCase()}${variant}.png`, blob)

            if (spriteIndex === 3 && bikeWalkingSelection[i] == "walking") {
               folder.file(`${characterName[i].trimEnd().toLowerCase()}_bike.png`, blob)
            }

            spriteIndex++
         }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      saveAs(zipBlob, "sprites.zip")
   }

   return (
      <>
         <header className={`${help ? "darken" : ""}`}>
            <img
               src="logo-left.png"
               className="logo-left"
            />
            <h1 className="heading">
               <span>Crystal Clear Sprite Sheet</span>
               <span>to Gen1recomp Converter</span>
               <span className="m-top highlight-4">(CCSS Converter)</span>
            </h1>
            <img
               src="logo-right.png"
               className="logo-right"
            />
         </header>

         <main>
            <div className="description-box">
               <div className={`description ${help ? "darken" : ""}`}>
                  <img
                     src="web-app-manifest-512x512.png"
                     className="little-guy"
                  />
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
                     <span >FM1337/FMCore/Sigkill</span>
                  </div>
                  <span>Click: <span className="public-template highlight-2">"USE PUBLIC TEMPLATE" ➡️</span></span>
                  <a href="https://inject.sigkill.tech/injector/sprite" target="_blank">Sprite Sheets Source</a>
                  <div className="stretch highlight-4">
                     <span>Use</span> <a href="https://github.com/on1san/Custom-Player-Sprite-Switcher/releases/latest">Custom Player Sprite</a> <span>to add them to gen1recomp</span>
                  </div>
               </div>
               <button className="help-button"
                  onClick={() => setHelp(!help)}>
                  {!help ? "HELP!" : "Hide Help"}
               </button>
            </div>
            {help ?
               <>
                  <Help
                     help={help}
                     handleHelpBottom={handleHelpBottom}
                  />
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

                     </>
                  }
               </div>}
         </main >
         <footer>The image files are not uploaded to any server. Everything runs in your browser locally.
            <br />
            <span className="footer-logo-bar">
               <img
                  src="icon-mini.png"
                  className="little-guy-mini"
               />
               <span className="copyright">CCSS Converter 2026</span>
               <img
                  src="icon-mini.png"
                  className="little-guy-mini"
               />
            </span>
         </footer>
      </>
   )
}

export default App
