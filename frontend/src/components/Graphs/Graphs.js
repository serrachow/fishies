import UMAP from '../../assets/umap.png';
import Projection from '../../assets/projection.png';

import './Graphs.css'

function Graphs() {
  return (
    <div className='graph-container'>
        <img src={Projection} alt="brain projection" className="projection-image" />
        <div className='divider'/>
        <img src={UMAP} alt="umap" className="umap-image" />
    </div>
  )
}

export default Graphs