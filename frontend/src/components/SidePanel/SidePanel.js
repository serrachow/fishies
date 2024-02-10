import './SidePanel.css'

import TextInput from '../TextInput/TextInput'

function SidePanel({children}) {

  return (
    <div className="glassmorphism sidepanel">
        <p>Filters</p>
        {/* pass a function as a prop to get value from input */}
        <TextInput width="100%" height="50px"/> 
        <div className="gene-container scrollbar scrollbar-black bordered-black square thin">
          {children}
        </div>
        <TextInput width="40%" height="7.5%" label="size"/>
        <TextInput width="40%" height="7.5%" label="size bg"/>
        <TextInput width="40%" height="7.5%" label="bg color"/>
    </div>
  )
}

export default SidePanel