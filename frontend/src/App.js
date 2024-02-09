import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Graphs from './components/Graphs/Graphs';
import ButtonLayout from './components/button_layout/button_layout';

function App() {
  const handleClick = () => {
    console.log('Button clicked!');
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs");
  };

  return (
    <div className="App">
      <Navbar/>
      <ButtonLayout onClick={handleClick} variant="default" >
        Gene Celltype
      </ButtonLayout>
      <Graphs/>
    </div>
  );
}

export default App;
