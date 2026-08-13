export default function Help({ help, handleHelpBottom }) {

   return (<>
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
   </>)
}