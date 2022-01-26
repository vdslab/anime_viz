
const Star = ({campaignData, campaignScale,}) => {
    return(
        <g>
            {campaignData.map((item1, idx) => {
                return(
                item1.map((item2, jdx) => {
                    return(item2.data >= 0 && item2.group === "放送開始" &&
                    <image
                    href="star.png"
                    height="15"
                    width="15"
                    x={campaignScale(item2.data) - 10}
                    y={16.5 + 40 * idx}
                    style={{pointerEvents: "none"}}
                    />
                    );
                })
                )
            })}
        </g>


    );
}

export default Star;
