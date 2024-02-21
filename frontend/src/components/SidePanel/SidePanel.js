import './SidePanel.css'

import TextInput from '../TextInput/TextInput'
import { useState } from 'react'

function SidePanel({children}) {

  // const [gene, setGene] = useState(null);

  return (
    <div className="glassmorphism sidepanel">
        <p>Filters</p>
        {/* pass a function as a prop to get value from input */}
        <div style={{marginBottom: children?("0px"):("50px")}}>
          <TextInput width="100%" height="50px" margin="50px" /> 
        </div>
        {/* shows children if there is children, meaning it's the cell side panel */}
        {children && 
          <div className="gene-container scrollbar scrollbar-black bordered-black square thin">
            {children}
          </div>
        }
        
        <TextInput width="40%" height="7.5%" label={(children ? "size" : "size min")}/>
        <TextInput width="40%" height="7.5%" label={(children ? "size bg" : "size max")}/>
        <TextInput width="40%" height="7.5%" label={(children ? "bg color" : "vmax")}/>
    </div>
  )
}

export default SidePanel