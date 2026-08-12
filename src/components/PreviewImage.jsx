import { AiOutlineDelete } from "react-icons/ai";

export default function PreviewImage({ index, fileUrls, handleNameChange, handleDelete, characterName = "", trainerCardSelection, handleRadioTrainer, handleRadioBike, bikeWalkingSelection }) {

   return (<>
      <div
         className="mid-section">
         <div className="preview-container">
            <img className="preview" src={fileUrls[index]} />
         </div>
         <div className="download-settings">
            <AiOutlineDelete
               className="delete-icon"
               onClick={() => handleDelete(index)}
            />
            <form className="name-form">
               <label className={`${characterName.trim().length == 0 ? "name-label-red" : ""}`} htmlFor={`name+${index}`}>Name</label>
               <input type="text" id={`name+${index}`} name={`name+${index}`}
                  className={`${characterName.trim().length == 0 ? "input-field-red" : ""}`}
                  onChange={(e) => handleNameChange(e, index)}
                  value={characterName}
               />
            </form>
            <fieldset>
               <legend>Trainer Card Sprite</legend>
               <div id="first-radio">
                  <input type="radio" id={`front+${index}`} name={`trainer-card-sprite+${index}`} value="front"
                     checked={trainerCardSelection[index] == "front"}
                     onChange={(e) => handleRadioTrainer(e, index)}
                  />
                  <label htmlFor={`front+${index}`}>Front</label>
               </div>

               <div id="second-radio">
                  <input type="radio" id={`trainer+${index}`} name={`trainer-card-sprite+${index}`} value="trainer"
                     checked={trainerCardSelection[index] == "trainer"}
                     onChange={(e) => handleRadioTrainer(e, index)}
                  />
                  <label htmlFor={`trainer+${index}`}>Trainer Card</label>
               </div>
            </fieldset>
            <fieldset>
               <legend>Cycling Sprite</legend>
               <div id="third-radio">
                  <input type="radio" id={`walking+${index}`} name={`cycling-sprite+${index}`} value="walking"
                     checked={bikeWalkingSelection[index] == "walking"}
                     onChange={(e) => handleRadioBike(e, index)}
                  />
                  <label htmlFor={`walking+${index}`}>Walking</label>
               </div>

               <div id="fourth-radio">
                  <input type="radio" id={`red_bike+${index}`} name={`cycling-sprite+${index}`} value="red"
                     checked={bikeWalkingSelection[index] == "red"}
                     onChange={(e) => handleRadioBike(e, index)}
                  />
                  <label htmlFor={`red_bike+${index}`}>red_bike</label>
               </div>
            </fieldset>
         </div>
      </div>
      <hr />
   </>)
}