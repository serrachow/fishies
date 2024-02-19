import './BottomDisplay.css';
import Truncate from './Truncate.js';

// takes in the genes showing currently
function BottomDisplay( {children, gene} ) {
  // console.log(limit, max, geneChildren.slice(max), length);

  // console.log(geneChildren);

  return (
    <div className="bottom-bar glassmorphism" style={{width: (gene)?("200px"):("700px"), justifyContent:(gene)?("center"):("flex-start")}}>
        <p class="showing">Showing:</p>
        {/* this is for cell */}
        {children && 
          <Truncate>
          {children}
          </Truncate>
        }

        {!children && 
          <p className="showing">{gene}</p>
        }
    </div>
  )
}

export default BottomDisplay