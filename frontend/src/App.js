import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Graphs from './components/Graphs/Graphs';
import ButtonLayout from './components/button_layout/button_layout';
import Coordinates from './components/Coordinates/Coordinates';
import BottomDisplay from './components/BottomDisplay/BottomDisplay';
import GeneComponent from './components/BottomDisplay/GeneComponent/GeneComponent';

function App() {
  const handleClick = () => {
    console.log('Button clicked!');
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs");
  };

  return (
    <div className="App">
      <Navbar/>
      <Coordinates/>
      <Graphs/>
      <BottomDisplay children={<GeneComponent geneName={"Mature DG neurons"}/>}/>
    </div>
  );
}

export default App;
