import React, {useState, useCallback, memo, FC} from "react";
import Tree from "react-tree-graph";
import {Box} from "@deity/falcon-ui";

export const BNFTree = memo(
    (({tree, nodes}) => {
        const [el, setEl] = useState(null);
        const [, update] = useState();

        // Event handlers to control collapsing of nodes
        const handleClick = useCallback(
            (event, nodeId) => {
                const node = nodes[nodeId];
                node.collapsed = !node.collapsed;
                update({});
            },
            [nodes]
        );
        const getChildren = useCallback(
            node => (node.collapsed ? null : node.children),
            []
        );

        // The tree
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
                ref={ref => !el && ref && setEl(ref)}>
                {el && (
                    <Tree
                        data={tree}
                        labelProp="symbol"
                        keyProp="id"
                        height={el.scrollHeight}
                        width={el.scrollWidth}
                        nodeRadius={7}
                        gProps={{
                            onClick: handleClick,
                        }}
                        getChildren={getChildren}
                        animated
                    />
                )}
            </Box>
        );
    }) as FC<{tree: object; nodes: object}>,
    ({tree, nodes}, {tree: newTree, nodes: newNodes}) => tree == newTree
);
