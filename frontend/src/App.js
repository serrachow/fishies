import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Graphs from './components/Graphs/Graphs';
import Coordinates from './components/Coordinates/Coordinates';
import BottomDisplay from './components/BottomDisplay/BottomDisplay';
import GeneComponent from './components/GeneComponent/GeneComponent';
import SidePanel from './components/SidePanel/SidePanel';

function App() {
  // const handleClick = () => {
  //   console.log('Button clicked!');
  //   window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs");
  // };

  return (
    <div className="App">
      <Navbar/>
      <div className="coordinates-container">
        <Coordinates/> <Coordinates/>
      </div>
      <SidePanel>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Immature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Immature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Immature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Immature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Immature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Immature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
      </SidePanel> */}

      <SidePanel />
      <Graphs/>
      {/* <BottomDisplay>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Mature DG neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
        <GeneComponent geneName={"Immature Neurons"}/>
      </BottomDisplay> */}

      <BottomDisplay gene="Rest"/>
    </div>
  );
}

export default App;
