import ButtonLayout from '../button_layout/button_layout.js';

import './Coordinates.css'
import TextInput from '../TextInput/TextInput'

function Coordinates() {

  const inputx = document.getElementById('inputx');
  const inputy = document.getElementById('inputy');

const xChange = () => {
  console.log('x change')
  console.log('Input X value:', inputx.value);
}
const yChange = () => {
  console.log('Input Y value:', inputy.value);
}


  return (
    <div className='coordinates'>
        {/* <input type="text" id="inputx" placeholder="x" size="4" onChange={xChange}/>
        <input type="text" id="inputy" placeholder="y" size="4" onChange={yChange}/> */}
        <TextInput width="20%" height="7.5%" label="x"/>
        <TextInput width="20%" height="7.5%" label="y"/>
    </div>
  )
}

export default Coordinates