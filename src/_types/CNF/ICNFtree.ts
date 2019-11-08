import {ICNFpattern, Isymbol} from "./ICNF";

export type ICNFtree =
    | {
          /** The symbol that this node represents */
          symbol: Isymbol;
          /** The pattern that this node was created from */
          pattern: ICNFpattern;
          /** The left subtree */
          left: ICNFtree;
          /** The right subtree */
          right: ICNFtree;
      }
    | {
          /** The symbol that this node represents */
          symbol: Isymbol;
      };
