import React from 'react'
import { Container, Typography, Button, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'

import useStyles from './styles'
import CartItem from './CartItem/CartItem'

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart }) => {
  const classes = useStyles()

  const handleEmptyCart = () => onEmptyCart()

  const renderEmptyCart = () => (
    <Typography variant="subtitle1">
      Você não tem itens no seu carrinho de compras.
      <Link className={classes.link} to="/">
        Vamos as Compras!!!
      </Link>
      !
    </Typography>
  )

  if (!cart.line_items) return 'Loading'

  const renderCart = () => (
    <>
      <Grid container spacing={3}>
        {cart.line_items.map((lineItem) => (
          <Grid item xs={12} sm={4} key={lineItem.id}>
            <CartItem item={lineItem} onUpdateCartQty={onUpdateCartQty} onRemoveFromCart={onRemoveFromCart} />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <Typography variant="h4">Total: {cart.subtotal.formatted_with_symbol}</Typography>
        <div>
          <Button
            className={classes.emptyButton}
            size="large"
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleEmptyCart}
          >
            Esvaziar Carrinho
          </Button>
          <Button
            className={classes.checkoutButton}
            component={Link}
            to="/checkout"
            size="large"
            type="button"
            variant="contained"
            color="primary"
          >
            Finalizar
          </Button>
          <br />
          <br />
        </div>
      </div>
    </>
  )

  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h3" gutterBottom>
        Seu Carrinho de Compras
      </Typography>
      {!cart.line_items.length ? renderEmptyCart() : renderCart()}
    </Container>
  )
}

export default Cart
