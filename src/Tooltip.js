import { useState } from 'react';


const Tooltip = ({toolref, abstract}) => {

  
  return (
    <g ref = {toolref} id="tooltip" style={{position : 'absolute', display:'none'}} className="card ">
      <g className='card-content hero '><text>{abstract ||'no info'}</text></g>
    </g>  
  );
};

export default Tooltip;