import * as d3 from 'd3';
import { useState } from 'react';

const CampaignPoint = ({campaignData, campaignScale, setDetail, checkJudge}) => {

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
                 
                  return (item2.data >= 0 && checkJudge[item2.group] &&
                    <circle 
                    cx = {campaignScale(item2.data)}
                    cy = {25 + 40 * idx}
                    r = '7'
                    onClick={() => {setDetail({"date":dt.getMonth(), "name":item2.name, "group":item2.group, "abstract": item2.abstract})}}
                    />
                  );

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