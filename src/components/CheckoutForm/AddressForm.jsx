import React, { useState, useEffect } from "react";
import {InputLabel,Select,MenuItem,Button,Grid,Typography,} from "@material-ui/core";
import {Link} from 'react-router-dom';

import { commerce } from "../../lib/commerce";

import { useForm, FormProvider } from "react-hook-form";
import FormInput from "./FormInput";

const AddressForm = ({ checkoutToken , next}) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingStates, setShippingStates] = useState([]);
  const [shippingState, setShippingState] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );

    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
    
  };

  const fetchStates = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setShippingStates(subdivisions);
    setShippingState(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async ( checkoutTokenId, country,region = null ) => {
    try {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });
            
          
           
    setShippingOption(options);
    setShippingOption(options[0].id);
    } catch (error) {
       console.log(error) 
    }
 
  };

  const methods = useForm();

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  const states = Object.entries(shippingStates).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  const options = shippingOptions.map((sO) => ({
    id: sO.id,
    label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
  }));


  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchStates(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingState) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingState);
  }, [shippingState]);
  console.log(options);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Adress
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) =>next({...data, shippingCountry , shippingState , shippingOption}) )}>
          <Grid container spacing={3}>
            <FormInput name="firstName" label="First Name" />
            <FormInput name="lastName" label="Last Name" />
            <FormInput name="Address1" label="Address" />
            <FormInput name="email" label="Email" />
            <FormInput name="city" label="City" />
            <FormInput name="zip" label="PIN Code" />
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setShippingCountry(e.target.value)}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Select State</InputLabel>
              <Select
                value={shippingState}
                fullWidth
                onChange={(e) => setShippingState(e.target.value)}
              >
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select
                value={shippingOption}
                fullWidth
                onChange={(e) => setShippingOption(e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br/>
          <div style={{display:"flex",justifyContent:"space-between"}}>
                    <Button variant="outlined" component={Link} to="/cart">Back to Cart</Button>
                    <Button  type="submit"  color="primary" variant="contained">Next</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
