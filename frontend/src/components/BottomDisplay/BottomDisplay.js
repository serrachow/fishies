import './BottomDisplay.css';

// takes in the genes showing currently
function BottomDisplay( {children} ) {
  return (
    <div className="bottom-bar glassmorphism">
        <p>Showing:</p>
        {children}
    </div>
  )
}

export default BottomDisplay