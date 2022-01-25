import * as d3 from 'd3';
import { useState } from 'react';

const CampaignPoint = ({campaignData, campaignScale}) => {
    return(
        <g>
            {campaignData.map((item1, idx) => {     
              return(
                item1.map((item2, jdx) => {
                  console.log(item2.data);
                  console.log(item2.abstract);
                  return item2.data > 550 || 
                    <circle 
                    cx = {campaignScale(item2.data)}
                    cy = {25 + 40 * idx}
                    r = '4'/>
                  ;
                })
              );
            })}
        </g>
    )
}

export default CampaignPoint;