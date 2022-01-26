import * as d3 from "d3";
import React, { useState, useEffect, useRef } from "react";
import classes from "./style.module.css";
import Tooltip from "./Tooltip";
import ColoredRect from "./ColoredRect";
import CampaignPoint from "./CampaignPoint";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [heatData, setHeatData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [menu, setMenu] = useState([]);
  const [detail, setDetail] = useState([
    { date: null, group: null, name: null, abstract: null },
  ]);
  const [hoverInfo, setHoverInfo] = useState("");
  const toolref = useRef(null);

  const showTooltip = (event, item) => {
    //console.log("3333");
    console.log(toolref.current.style.left);
    //setHoverInfo(item.abstract)
    toolref.current.style.left = event.pageX + 10 + "px";
    toolref.current.style.top = event.pageY + 10 + "px";
    toolref.current.style.display = "block";

    console.log(toolref.current.style.left);
  };

  const hideTooltip = (event) => {
    toolref.current.style.display = "none";
  };

  const checkJudged = {
    プレゼント応募: true,
    "フォロー＋RT": true,
    "フォロー＋ハッシュタグ": true,
    RT: true,
    ハッシュタグ: true,
    指定ツイート: true,
    投稿: true,
    "毎日情報解禁（キャラ情報など）": true,
    "カウントダウン投稿（画像）": true,
    "カウントダウン投稿（動画）": true,
    定期投稿: true,
    その他: true,
  };

  const [checkJudge, setCheckJudge] = useState(checkJudged);

  const handleChangeCheck = (e) => {
    const newCheck = Object.assign({}, checkJudge, {
      [e.target.value]: !checkJudge[e.target.value],
    });

    setCheckJudge(newCheck);
  };

  const margin = {
    top: 10,
    bottom: 50,
    left: 50,
    right: 100,
  };

  const contentWidth = 700;
  const contentHeight = 330;
  const beginTime = new Date(2021, 5 - 1, 1);
  const endTime = new Date(2022, 1 - 1, 31);

  const difference = (date1, date2) => {
    const date1utc = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const date2utc = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    const day = 1000 * 60 * 60 * 24;
    return (date2utc - date1utc) / day;
  };

  const invertTimeType = (date) => {
    return new Date(
      date.substring(0, 4),
      date.substring(4, 6) - 1,
      +date.substring(6, 8)
    );
  };

  useEffect(() => {
    (async () => {
      const request = await fetch("anime_data.json");
      const data = await request.json();
      setData(data);
      const tmpHeat = [];
      const tmpCampaign = [];
      data.map((item) => {
        const tmp = [];
        for (let idx = 0; idx < item["follower"].length - 1; idx++) {
          tmp.push(
            1.0 * item["follower"][idx + 1]["number"] -
              item["follower"][idx]["number"]
          );
        }
        tmpHeat.push(tmp);

        tmpCampaign.push(item.campaign.map((c) => c));
      });
      setHeatData(tmpHeat);
      tmpCampaign.map((item1, i) => {
        item1.map((item2, j) => {
          item2.data = difference(beginTime, invertTimeType(item2.data));
        });
      });

      setCampaignData(tmpCampaign);
    })();
  }, []);

  console.log(data);
  console.log(heatData);
  console.log(campaignData);

  const color = [];
  heatData.map((item) => {
    color.push(
      d3
        .scaleLinear()
        .domain([Math.min(...item), 0, Math.max(...item)])
        .range(["blue", "white", "red"])
    );
  });

  console.log(color);
  //const tu = ["20210802", "20211213", "20211214", "20211222", "20211226", "20210128", "20210208","20210222","20211011","20211011","20211017"];
  //console.log(tu);
  //const time = tu.map((item) => {
  //  return new Date(+item.substring(0, 4), +item.substring(4, 6)-1, +item.substring(6, 8));
  //});
  //console.log(time);
  //time.sort((a, b) => {
  //  return (a > b ? 1 : -1);
  //});

  //console.log(time);

  //const timeDomain = [];

  //for(let i = 0; i < time.length; i++) {
  //  timeDomain.push(difference(beginTime, time[i]) <= 0 || difference(beginTime, time[i]));
  //  console.log(difference(beginTime, time[i]));
  //}

  //const color = d3.scaleLinear().range(['white', 'red']).domain([Math.min(...heatData), Math.max(...heatData)])
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;
  const scale = d3
    .scaleBand()
    .range([0, contentWidth / 1.5])
    .domain(d3.range(heatData.length));
  const campaignScale = d3
    .scaleLinear()
    .domain([0, difference(beginTime, endTime)])
    .range([260, 710]);
  //let idx = 0;
  return (
    <div>
      <div className="header">
        <h1>Anime viz</h1>
      </div>
      <div className="hamburger">
        <input
          type="checkbox"
          id={classes.hamburger_check}
          className={classes.hamburger_hidden}
        ></input>
        <label for={classes.hamburger_check} className={classes.menu_Bt}>
          <span></span>
        </label>

        <nav className={classes.contents} style={{ overflowY: "scroll" }}>
          <section className="section">
            <div className="content">
              <h1 className="title is-3">詳細絞り込み</h1>
            </div>

            {Object.keys(checkJudged).map((item, idx) => {
              return (
                <div className="content">
                  <label for={"check" + String(idx)}>
                    <input
                      type="checkbox"
                      id={"check" + String(idx)}
                      value={item}
                      onChange={handleChangeCheck}
                      checked={checkJudge[item]}
                    ></input>
                    {item}
                  </label>
                </div>
              );
            })}

            <div className="content">
              <h1 className="title is-3">詳細</h1>

              <div className="content">
                <p className="content">日付：{detail["date"]}</p>
                <p className="content">分類：{detail["group"]}</p>
                <p className="content">施策名：{detail["name"]}</p>
                <p className="content">施策内容：{detail["abstract"]}</p>
                <br />
                <br />
                <br />
              </div>

              <p></p>
            </div>
          </section>
        </nav>
      </div>
      <div className="graph">
        <div className={classes.graphs}>
          <svg
            viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
            style={{ border: "solid 1px", paddingTop: "20px" }}
          >
            <g>
              <text x={280} y={0} fontSize={8}>
                5月
              </text>
              <text x={330} y={0} fontSize={8}>
                6月
              </text>
              <text x={380} y={0} fontSize={8}>
                7月
              </text>
              <text x={430} y={0} fontSize={8}>
                8月
              </text>
              <text x={480} y={0} fontSize={8}>
                9月
              </text>
              <text x={530} y={0} fontSize={8}>
                10月
              </text>
              <text x={580} y={0} fontSize={8}>
                11月
              </text>
              <text x={630} y={0} fontSize={8}>
                12月
              </text>
              <text x={680} y={0} fontSize={8}>
                1月
              </text>
            </g>

            <ColoredRect
              heatData={heatData}
              color={color}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
            <CampaignPoint
              campaignData={campaignData}
              campaignScale={campaignScale}
              setDetail={setDetail}
              checkJudge={checkJudge}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
              setHoverInfo={setHoverInfo}
            />

            <g>
              {data.map((item, i) => {
                return (
                  <text
                    x={scale(0) - margin.left + 10}
                    y={40 * i + 30}
                    font-size="10"
                  >
                    {data[i]["title"]}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>

        <Tooltip toolref={toolref} abstract={hoverInfo} />
      </div>
      <div class="explanation">
        <div class="content">
          <h3>
            <strong>使い方</strong>
          </h3>
          <p>
            <br />
            <strong>グラフについて</strong>
            <br />
            上から、直近のフォロワー数が多い作品順に並んでいます。
            <br />
            黒丸はSNS施策、星印はアニメの放送開始日を表しています。
            PCの場合、黒丸の上にマウスを置くと施策のを見ることが出来ます。
            <br />
            <br />
            <strong>詳細絞り込みについて</strong>
            <br />
            PCの場合は画面右部分、スマートフォンの場合はハンバーガーメニューを開いて、詳細絞り込みをすることができます。
            <br />
            チェックボックスにチェックを入れた分類の施策のみを絞り込んで見ることが出来ます。
            <br />
            <br />
            <strong>詳細について</strong>
            <br />
            詳細絞り込みの下の「詳細」では施策の詳細を見ることが出来ます。
            <br />
            日付：いつからその施策が始まったか
            <br />
            分類：どのような分類の施策か
            <br />
            施策名：施策の名前
            <br />
            施策内容：どのような施策なのか
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
