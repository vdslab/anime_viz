import * as d3 from 'd3';
import { useState } from 'react';

const CampaignPoint = ({campaignData, campaignScale, setDetailText, setDetailDate}) => {

  const beginTime = new Date(2021, 5-1, 1);
    return(
        <g>
            {campaignData.map((item1, idx) => {     
              return(
                item1.map((item2, jdx) => {
                  console.log(item2.data);
                  console.log(item2.abstract);

                  const dt = new Date(beginTime.getTime())
                  console.log(dt.getDate());
                  dt.setDate(dt.getDate() + item2.data);
                  console.log(dt.getFullYear());
                  return item2.data > 550 || 
                    <circle 
                    cx = {campaignScale(item2.data)}
                    cy = {25 + 40 * idx}
                    r = '7'
                    onClick={() => {setDetailText(item2.abstract),
                    setDetailDate(dt.getFullYear())}}
                    />

                    //item1.abstract キャンペーン概要
                    //item1.name キャンペーン名前
                  ;
                })
              );
            })}
        </g>
    )
}

export default CampaignPoint;