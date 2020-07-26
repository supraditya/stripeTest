import React, {useState} from 'react';
import './App.css';
import StripeCheckout from 'react-stripe-checkout';


const App=()=>{
  const [product, setProduct]=useState({
    name: "React",
    price:100,
    productBy: "Facebook"
  });
  const makePayment=token=>{
    const body={
      token,
      product
    }
    const headers={
      "Content-Type": "application/json"
    }
    // Note: Stripe only works on https websites in live conditions
    return fetch('https://localhost:8282/payment',{
      method:"POST",
      headers,
      body:JSON.stringify(body)
    }).then(response=>{
      console.log("RESPONSE", response)
      const {status}=response
      console.log("STATUS:", status)
    })
    .catch(error=>console.log(error));
  
  }
  return(
  <div className="App">
    <h1>App Works!</h1>
    <button className="waves-effect waves-light btn">button</button>
    <br/>
    <br/>
    {/* stripeKey and token are compulsory props */}
    <StripeCheckout 
    stripeKey='pk_test_51H8GwlHKGny9wowzLIIz1Ayiawt4R9pORw9sKUKOZWb58zlw2hrLcRyfHS2YLbIQaljUMHfgQEOudSuYn1T6rMlZ00krdo4m80' 
    token={makePayment} 
    name="Buy React"
    amount={product.price}>
    <button className="waves-effect waves-light btn pink">Buy React for just Rs.{product.price} (Totally Real)</button>
    </StripeCheckout>      
  </div>
  )
  
}
export default App;
