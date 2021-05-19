import React from 'react'
import { Typography, Button, Divider } from '@material-ui/core'
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import Review from './Review'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout, timeout }) => {
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault()

    if (!stripe || !elements) return //Se não tiver ambos, só retonra não tem nada.

    const cardElement = elements.getElement(CardElement)

    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement })

    if (error) {
      console.log('[error]', error)
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
        shipping: {
          name: 'International',
          street: shippingData.address1,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry,
        },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      }
      onCaptureCheckout(checkoutToken.id, orderData) // precisamos disso para rliberar os fields
      timeout()
      // se não tiver um erro, temos esse grande objeto que contem a ordem a partir da API.
      nextStep()
    }
  }

  return (
    // aqui vamos iniciar com apenas um fragmento react
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>
        Payment method
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              <CardElement />
              <br /> <br />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={backStep}>
                  Voltar
                </Button>
                <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                  Pagar {checkoutToken.live.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  )
}
//Eu faço aquela função sem retorno pq eu tenho q aceitar parametros de stripes e elemntos.
export default PaymentForm
