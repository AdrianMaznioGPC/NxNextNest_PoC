import { Grid as BaseGrid, GridItem } from "@commerce/ui";

/**
 * Re-export with compound component API for backwards compatibility.
 * New code should import { Grid, GridItem } from "@commerce/ui" directly.
 */
const Grid = Object.assign(BaseGrid, { Item: GridItem });

export default Grid;
