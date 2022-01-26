import { useState } from 'react';
import * as d3 from "d3";

const ColoredRect = ({heatData,color}) => {
    
    return(<g>
        {
        heatData.map((array, i)=> {
            console.log(array)
            //console.log(color)
            return(
            array.map((item, j) => {
              //console.log(color[i](item))
              //console.log(scale(j))
              //console.log(idx++);
              return(
                <g>
                

              <rect 
                x = {50*j + 260}
                y = {40*i + 10}
                width={50}
                height={31}
                fill={color[i](item)}
              />
         
              </g>
              
              );
            }) 
            );
          })
        }

        
        </g>
    );
}

export default ColoredRect;