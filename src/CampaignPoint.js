import * as d3 from 'd3';
import { useState } from 'react';

const CampaignPoint = ({campaignData, campaignScale, setDetail, checkJudge,  showTooltip, hideTooltip, setHoverInfo}) => {
  const show = (e) => {
    showTooltip(e);
    
  }
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
                 
                  return (item2.data >= 0 && checkJudge[item2.group] && item2.group !== '放送開始'?
                    <circle 
                    cx = {campaignScale(item2.data)}
                    cy = {25 + 40 * idx}
                    r = '7'
                    onMouseMove={(e) => {
                      setHoverInfo(item2.name || item2.abstract)
                      showTooltip(e)}}
                    onMouseLeave={hideTooltip}
                    onClick={() => {setDetail({"date":String(dt.getFullYear())+'/'+String(dt.getMonth() + 1)+'/'+ String(dt.getDate()) , "name":item2.name, "group":item2.group, "abstract": item2.abstract})}}
                    /> : item2.data >= 0 && item2.group === '放送開始' && 
                    <image href="star.png" height="21" width="21"
                     x = {campaignScale(item2.data)-10}
                     y = {13.5 + 40 * idx}
                     onMouseMove={(e) => {
                      setHoverInfo(item2.name || item2.abstract)
                      showTooltip(e)}}
                      onMouseLeave={hideTooltip}
                      onClick={() => {setDetail({"date":String(dt.getFullYear())+'/'+String(dt.getMonth() + 1)+'/'+ String(dt.getDate()) , "name":item2.name, "group":item2.group, "abstract": item2.abstract})}}
                    />
                  );

                  ;
                })
              );
            })}
        </g>
    )
}

export default CampaignPoint;