import './GeneComponent.css'

function GeneComponent({geneName, active}) {
  return (
    <div className="glassmorphism gene">
        <p>{geneName}</p>
    </div>
  )
}

export default GeneComponent