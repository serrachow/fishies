import './GeneComponent.css'

function GeneComponent({geneName, active}) {

  let geneClass = "glassmorphism gene ";

  switch (geneName) {
    case 'Mature DG neurons':
      geneClass += "yellow";
      break;
    case 'Immature Neurons':
      geneClass += "pink"
      break;
    case 'Immature DG neurons':
      geneClass += "purple"
      break;
    default:
      geneClass += "yellow";
      break
  }

  return (
    <div className={geneClass}>
        <p>{geneName}</p>
    </div>
  )
}

export default GeneComponent