import React, {useEffect, useState, FC} from "react";
import d3 from "d3"; // Import before function-plot
window["d3"] = d3;
import functionPlot from "function-plot";
import {Box} from "@deity/falcon-ui";

export type Interval = {lo: number; hi: number};
export const Plotter: FC<{
    type: "linear" | "implicit";
    func:
        | ((data: {x: Interval}) => Interval)
        | ((data: {x: Interval; y: Interval}) => Interval);
}> = ({type, func, ...rest}) => {
    const [el, setEl] = useState(null);
    useEffect(() => {
        if (el)
            functionPlot({
                target: el,
                // yAxis: {domain: [-1, 9]},
                tip: {
                    renderer: function() {},
                },
                grid: true,
                data: [
                    {
                        fnType: type,
                        fn: func,
                    },
                ],
                width: el.scrollWidth,
                height: el.scrollHeight,
            });
    }, [type, el, func]);

    return <Box {...rest} ref={e => !el && e && setEl(e)}></Box>;
};
