import React, {useState, useEffect} from "react";
import Tree from "react-tree-graph";
import {Box, themed} from "@deity/falcon-ui";

export const BNFTree = ({data}) => {
    const [el, setEl] = useState(null);
    return (
        <Box
            css={({theme}) => ({
                height: "100%",
                overflow: "hidden",
                svg: {
                    fontFamily: theme.fonts.mono,
                },
                ".node": {
                    circle: {
                        fill: theme.colors.primaryDark,
                    },
                },
                ".link": {
                    fill: "none",
                    stroke: theme.colors.primary,
                },
            })}
            ref={setEl}>
            {el && (
                <Tree
                    data={data}
                    labelProp="symbol"
                    height={el.scrollHeight}
                    width={el.scrollWidth}
                    animated
                />
            )}
        </Box>
    );
};
