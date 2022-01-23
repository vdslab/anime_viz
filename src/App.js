import * as d3 from "d3";
import React, {useState, useEffect} from "react";
import classes from "./style.module.css";

function App() {
  const [data, setData] = useState([]);
  const [heatData, setHeatData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [menu, setMenu] = useState([]);
  const [detailDate, setDetailDate] = useState([]);
  const [detailText, setDetailText] = useState([]);

  function handleChangeDate(e){
    setDetailDate(e);
  }
  function handleChangeText(e){
    setDetailText(e);
  }

  const checkJudged = { checkB1: true, checkB2: true, checkB3: true, checkB4: true, checkB5: true}

  const [checkJudge, setCheckJudge] = useState(checkJudged);

  const handleChangeCheck = e =>{
    const newCheck = Object.assign({}, checkJudge, {
      [e.target.value]: !checkJudge[e.target.value]
    });
    setCheckJudge(newCheck);
  }

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

  const invertTimeType = (date) => {
    return new Date(+date.substring(0, 4), +date.substring(4, 6)-1, +date.substring(6, 8));
  }
  
  
  useEffect(() => {
    (async () => {
      const request = await fetch("sample.json");
      const data = await request.json();
      setData(data);

      const tmpHeat = [];
      const tmpCampaign = [];
      data.map((item) => {
        const tmp = [];
        for(let idx = 0; idx < item['follower'].length-1;idx++) {
          tmp.push(1.0*item['follower'][idx+1]['number'] - item['follower'][idx]['number']);
        }
        tmpHeat.push(tmp);

        tmpCampaign.push(item.campaign.map((c => c)));
      })

      setHeatData(tmpHeat);
      setCampaignData(tmpCampaign);


      
    })();
  }, []);

  console.log(data);
  console.log(heatData);
  console.log(campaignData);

  
  const color = []
  heatData.map((item) => {
    color.push(d3.scaleLinear()
    .domain([Math.min(...item), 0 ,Math.max(...item)])
    .range(["blue", "white", "red"])
    );
  });

  console.log(color);
  const tu = ["20210802", "20211213", "20211214", "20211222", "20211226", "20210128", "20210208","20210222","20211011","20211011","20211017"];
  console.log(tu);
  const time = tu.map((item) => {
    return new Date(+item.substring(0, 4), +item.substring(4, 6)-1, +item.substring(6, 8));
  });
  console.log(time);
  time.sort((a, b) => {
    return (a > b ? 1 : -1);
  });

  console.log(time);

  const timeDomain = [];
  const beginTime = new Date(2021, 5-1, 1);
  const endTime = new Date(2021, 12-1, 31);
  for(let i = 0; i < time.length; i++) {
    timeDomain.push(difference(beginTime, time[i]) <= 0 || difference(beginTime, time[i]));
    console.log(difference(beginTime, time[i]));
  }

  const campaignData_copy = [...campaignData];
  console.log(campaignData_copy);

  campaignData_copy.map((item1, i) => {
    item1.map((item2, j) => {
      item2.data = difference(beginTime,invertTimeType(item2.data)); 
    })
  })

  console.log(campaignData_copy);
  //setCampaignData(campaignData_copy);
  console.log(campaignData);


  //const color = d3.scaleLinear().range(['white', 'red']).domain([Math.min(...heatData), Math.max(...heatData)])
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;
  const scale = d3.scaleBand().range([0, contentWidth/ 1.5]).domain(d3.range(heatData.length));
  const campaignScale = d3.scaleLinear().domain([0, difference(beginTime, endTime)]).range([150, 550]);
  //let idx = 0;
    return (
      
      <div>
        <div className="hamburger">
          <input type="checkbox" id={classes.hamburger_check} className={classes.hamburger_hidden}></input>
          <label for={classes.hamburger_check} className={classes.menu_Bt}>
            <span></span>
          </label>
          
          <nav className={classes.contents}>
            <section className="section">
              <div className="content">
                <h1 className="title is-3" >
                  詳細絞り込み
                </h1>
              </div>
              <div className="content">
                <input type="checkbox" id="check" value="checkB1" onChange={handleChangeCheck} checked={checkJudge["checkB1"]}></input>
                <label for="check">キャンペーン1</label>
              </div>
              <div className="content">
                <input type="checkbox" id="check2" value="checkB2" onChange={handleChangeCheck} checked={checkJudge["checkB2"]}></input>
                <label for="check2">キャンペーン2</label>
              </div>
              <div className="content">
                <input type="checkbox" id="check3" value="checkB3" onChange={handleChangeCheck} checked={checkJudge["checkB3"]}></input>
                <label for="check3">キャンペーン3</label>
              </div>
              <div className="content">
                <input type="checkbox" id="check4" value="checkB4" onChange={handleChangeCheck} checked={checkJudge["checkB4"]}></input>
                <label for="check4">キャンペーン4</label>
              </div>
              <div className="content">
                <input type="checkbox" id="check5" value="checkB5" onChange={handleChangeCheck} checked={checkJudge["checkB5"]}></input>
                <label for="check5">キャンペーン5</label>
              </div>

              <div className="content">
                <h1 className="title is-3">
                  詳細
                </h1>
                <div className="content">
                  <p className="content">日付：{detailDate}</p>
                  <p className="content">キャンペーン内容：{detailText}</p>
                </div>
              </div>
            </section>
          </nav>
        </div>


        <div className={classes.graphs}>
          <svg
          viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
          style={{ border: "solid 1px" }}
        >

          <g>
            <text x = {170} y = {0} fontSize={8}>5月</text>
            <text x = {220} y = {0} fontSize={8}>6月</text>
            <text x = {270} y = {0} fontSize={8}>7月</text>
            <text x = {320} y = {0} fontSize={8}>8月</text>
            <text x = {370} y = {0} fontSize={8}>9月</text>
            <text x = {420} y = {0} fontSize={8}>10月</text>
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
                r = "5"
                onClick={() => {
                  handleChangeDate(tu[idx]);
                  handleChangeText(data[0]['campaign'][idx]['abstract']);
                }}
                />
              );
            })}
          </g>

          <g>
            {campaignData_copy.map((item1, idx) => {
              
              return(
                item1.map((item2, jdx) => {
                  console.log(item2.data);
                  console.log(item2.abstract);
                  return item2.data > 550 || 
                    <circle 
                    cx = {campaignScale(item2.data)}
                    cy = {25 + 40 * idx}
                    r = '6'/>
                  ;
                })
              );
            })}
          </g>


          <g>
              {data.map((item, i) => {
                return(
              <text 
              x = {scale(0) - margin.left + 10 }
              y = {40*i + 30}
              font-size="10"
              >{data[i]['title']}
              </text>
                );
              })}
            </g>
     
        </svg>
      
        </div>
      </div>
    );
  }
  
  export default App;