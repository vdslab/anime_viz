import * as d3 from "d3";
import React, {useState, useEffect} from "react";
import classes from "./style.module.css";

function App() {
  const [data, setData] = useState([]);
  const [heatData, setHeatData] = useState([]);
  const [menu, setMenu] = useState([]);

  const margin = {
    top: 10,
    bottom: 50,
    left: 50,
    right: 100,
  };
  const contentWidth = 600;
  const contentHeight = 700;

  const difference = (date1, date2) => {
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const day = 1000*60*60*24;
    return(date2utc - date1utc)/day;
  }
  
  useEffect(() => {
    (async () => {
      const request = await fetch("sample.json");
      const d = await request.json();
      setData(d);

  

      const tmpHeat = [];
      d.map((item) => {
        const tmp = [];
        for(let idx = 0; idx < item['follower'].length-1;idx++) {
          tmp.push(1.0*item['follower'][idx+1]['number'] - item['follower'][idx]['number']);
        }

        tmpHeat.push(tmp);
      })

      console.log(tmpHeat);
    
      
      setHeatData(tmpHeat);
    })();
  }, []);

  console.log(data);
  console.log(heatData);

  
  const color = []
  heatData.map((item) => {
    color.push(d3.scaleLinear()
    .domain([Math.min(...item), 0 ,Math.max(...item)])
    .range(["blue", "white", "red"])
    );
  });

  console.log(color)

  const tu = ["20210802", "20211213", "20211214", "20211222", "20211226", "20210128", "20210208","20210222","20211011","20211011","20211017", "20211231", "20210501"];
  console.log(tu);
  const time = tu.map((item) => {
    return new Date(+item.substring(0, 4), +item.substring(4, 6)-1, +item.substring(6, 8));
  });

  console.log(time);
  time.sort((a, b) => {
    return (a > b ? 1 : -1);
  });

  console.log(time);

  const timeDomain = [0];

  for(let i = 4; i < time.length; i++) {
    timeDomain.push(difference(time[3], time[i]));
  }

  console.log("####");
  console.log(timeDomain);


  //const color = d3.scaleLinear().range(['white', 'red']).domain([Math.min(...heatData), Math.max(...heatData)])
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;
  const scale = d3.scaleBand().range([0, contentWidth/ 1.5]).domain(d3.range(heatData.length));
  const campaignScale = d3.scaleLinear().domain([Math.min(...timeDomain), Math.max(...timeDomain)]).range([150, 550]);
  //let idx = 0;
    return (
      <div>
        <div className="hamburger">
          <input type="checkbox" id={classes.hamburger_check} className={classes.hamburger_hidden}></input>
          <label for={classes.hamburger_check} className={classes.menu_Bt}>
            <span></span>
          </label>
          
          <div className={classes.contents}>
            <ul>
              <li>
                <a href="">link1</a>
              </li>
            </ul>
          </div>
        </div>
        <svg
        viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        style={{ border: "solid 1px" }}
      >

        <g>
          <text x = {156} y = {0} fontSize={8}>5月</text>
          <text x = {185} y = {0} fontSize={8}>6月</text>
          <text x = {210} y = {0} fontSize={8}>7月</text>
          <text x = {235} y = {0} fontSize={8}>8月</text>
          <text x = {260} y = {0} fontSize={8}>9月</text>
          <text x = {285} y = {0} fontSize={8}>10月</text>
        </g>
          <g>
            {heatData.map((array, i)=> {
              console.log(array)
              //console.log(color)
              return(
              array.map((item, j) => {
                //console.log(color[i](item))
                //console.log(scale(j))
                //console.log(idx++);
                return(
                  <g>
                    <text 
                    x = {scale(0) - margin.left + 10 }
                    y = {50*i + 30}
                    font-size="10"
                    >{data[i]['title']}</text>

                <rect 
                  x = {50*j + 150}
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

          <g>
            {timeDomain.map((item, idx) => {

              console.log(item);
              return(
                <circle
                cx = {campaignScale(item)}
                cy = {25}
                r = "3"
                />
              );
            })}
          </g>
     
        </svg>
      </div>
    );
  }
  
  export default App;