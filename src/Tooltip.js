
import { useState } from 'react';
//import './Tooltip.css';

const Tooltip = ({ children, content }) => {

  const [show, setShow] = useState(false);
  return (
    <div className="container">
      <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      >{children}</div>
      {show && <div>{content}</div>}
    </div>
  );
};

export default Tooltip;