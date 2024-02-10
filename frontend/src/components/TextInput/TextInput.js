import { useState } from "react";

import './TextInput.css'

function TextInput({width, height, label}) {
    const [focused, setFocused] = useState(false);

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    const fieldName = `field glassmorphism ${focused ? "focussed" : ""}`


    return (
        <div className={fieldName} onFocus={onFocus} onBlur={onBlur} style={{width: width, height: height}}>
            <input type="text" placeholder={label}/>
        </div>
    )
}

export default TextInput