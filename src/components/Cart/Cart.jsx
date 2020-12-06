import React from 'react'
import {Container,Typography,Grid,Button} from '@material-ui/core';
import {Link} from 'react-router-dom';

import useStyles from './Styles'
import CartItem from './CartItem/CartItem'

const Cart = ({cart,handleUpdateQty,handleRemoveFromCart,handleEmptyCart}) => {
    

    const classes = useStyles();
    
    if(!cart.line_items) cart.line_items = []

    const EmptyCart = ()=>(

        <Typography variant="subtitle1">You have no items in your shopping cart, 
        <Link to="/" className={classes.link}>start adding some!</Link>
        </Typography>

    );

    const FilledCart = ()=> (
<>

          <Grid container spacing={3}>
          {cart.line_items.map((item) => (
          <Grid container
  direction="row"
  justify="center"
  alignItems="stretch" item xs={12} sm={4} key={item.id}>
          <CartItem item={item} handleUpdateQty={handleUpdateQty} handleRemoveFromCart={handleRemoveFromCart}/>
          </Grid>

        ))}
          </Grid>
          <div className={classes.cardDetails}>
              <Typography variant="h5">Subtotal : {cart.subtotal.formatted_with_symbol}  </Typography>
              <div>
    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Checkout</Button>
</div>
          </div>

    
         
    
</>
    )

    return (
       <Container>
           <div className={classes.toolbar}/>

<Typography className={classes.title} variant="h5">Your Shopping Cart </Typography>
{!cart.line_items.length ? <EmptyCart/> : <FilledCart/>}

       </Container>
    )
}

export default Cart
