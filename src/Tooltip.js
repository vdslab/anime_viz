import { useState } from 'react';


const Tooltip = ({toolref, abstract}) => {

  
  return (
    <g ref = {toolref} id="tooltip" style={{position : 'absolute', display:'none'}} className="card ">
      <g className='card-content hero is-primary'>{abstract ||'no info'}</g>
    </g>  
  );
};

export default Tooltip;