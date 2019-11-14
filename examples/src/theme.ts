import {Theme} from "@deity/falcon-ui";

// theme could have been changed here, but I didn't really bother
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
