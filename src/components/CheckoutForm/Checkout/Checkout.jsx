import React,{useState,useEffect} from 'react';
import {Paper,Stepper,Step,Steplabel,Typography,CircularProgress,Divider,Button, CssBaseline,StepLabel} from '@material-ui/core'
import useStyles from './Styles';
import AdressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import {commerce} from '../../../lib/commerce';
import { Link, useHistory } from 'react-router-dom';

const steps = ['Shipping adress', 'Payment details']

const Checkout = ({cart, order,onCaptureCheckout,error}) => {

    const [activeStep,setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData,setShippngData] = useState({})
    const classes = useStyles();
    const [isFinished,setIsFinished] = useState(false)
    const history = useHistory();

    useEffect(()=>{

        const generatToken = async ()=>{

            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

                setCheckoutToken(token)
                
                
            } catch (error) {
                console.log(error)
                if (activeStep !== steps.length) history.push('/');
            }

        }

        generatToken();

    },[cart])

    const nextStep = () => setActiveStep((prev) => prev +1 ) 
    const backStep = () => setActiveStep((prev) => prev -1 ) 

    const next = (data)=>{

        setShippngData(data);
        nextStep();
    }

            const timeout = () =>{

                setTimeout(()=>{

                    setIsFinished(true)
                },3000)
            }

    let Confirmation = ()=> order.customer ? (

       <>
       <div>

        <Typography variant="h5">Thank You for your purchase {order.customer.firstname} {order.customer.lastname}</Typography>
        <Divider className={classes.divider}/>
        <Typography variant="subtitle2">Order ref : {order.customer_refrerence}</Typography>
        <br/>
        <Button compoent={Link} to="/" variant="outlined" type="button"   >Back to Home</Button>
        

       </div>
       </>
    ): isFinished ?(
        <>
        <div>
 
         <Typography variant="h5">Thank You for your purchase </Typography>
         <Divider className={classes.divider}/>
         
         <br/>
         <Button compoent={Link} to="/" variant="outlined" type="button"   >Back to Home</Button>
         
 
        </div>
        </>
        ):(

        <div className={classes.spinner}>

        <CircularProgress/>

        </div>
        
    )

    if(error){

        <>
        <Typography variant="h5">Error : {error}</Typography>
        <br/>
        <Button compoent={Link} to="/" variant="outlined" type="button"   >Back to Home</Button>
        </>
    }

    const Form = ()=> activeStep === 0
    ? <AdressForm checkoutToken={checkoutToken} next={next}/>
    : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />

    return (
        <>
        <CssBaseline/>
         <div className={classes.toolbar}/>   
         <main className={classes.layout}>
         <Paper className={classes.paper}>
             <Typography variant="h5" align="center" >Checkout</Typography>
             <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map(step =>(
                    <Step key={step}>
                    <StepLabel>
                        {step}
                    </StepLabel>

                    </Step>
                ))}
             </Stepper>
             {activeStep === steps.length ? <Confirmation/>: checkoutToken&& <Form/>}
         </Paper>

         </main>
         </>
        
    )
}

export default Checkout
