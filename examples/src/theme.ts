import {Theme} from "@deity/falcon-ui";

export const customizedTheme = (theme: Theme) => ({
    ...theme,
    ...{
        colors: {
            primary: "#A9CF38",
        },
        fonts: {
            sans: '"Comic Sans MS", "Comic Sans", cursive',
        },
    },
});
