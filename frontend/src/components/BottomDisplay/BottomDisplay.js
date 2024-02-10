import './BottomDisplay.css';
import Truncate from './Truncate.js';

// takes in the genes showing currently
function BottomDisplay( {children} ) {
  // console.log(limit, max, geneChildren.slice(max), length);

  // console.log(geneChildren);

  return (
    <div className="bottom-bar glassmorphism">
        <p id="showing">Showing:</p>
        <Truncate>
          {children}
        </Truncate>
    </div>
  )
}

export default BottomDisplay