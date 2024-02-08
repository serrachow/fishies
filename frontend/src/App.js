import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ButtonLayout from './components/button_layout/button_layout';

function App() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="App">
      <Navbar/>
      <p className="test">Hello world</p>
      <ButtonLayout onClick={handleClick} variant="default">
        XXXXX
      </ButtonLayout>
    </div>
  );
}

export default App;
