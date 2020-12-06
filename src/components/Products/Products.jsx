import React from 'react';
import {Grid} from '@material-ui/core';
import Product from './Product/Product'

import useStyles from './Styles';




const Products = ({products,onAddToCart})=>{

    const classes = useStyles();


return (


    <main className={classes.content}>

<Grid  container
  direction="row"
  justify="center"
  alignItems="stretch"  spacing={4}>
<div className={classes.toolbar} />

{products.map(product => (


<Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>

    <Product product={product} onAddToCart={onAddToCart} />
</Grid>

))}


</Grid>

</main>

)


}

export default Products;