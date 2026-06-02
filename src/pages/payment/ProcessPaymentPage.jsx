import {useState, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js";
import {Elements, CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {useError} from '../../components/ErrorDisplay';
import {initializePayment, updatePaymentStatus} from '../../api/paymentApi';

const stripeInstance = loadStripe('pk_test_51TtpCU19YP4hMv8mXQFWlbrGSzgkEQkeGsyBfi5Re69yT4iAOIonfbsvhxyK31isLxGVdhYPMjag92k2jEwHR7in00cuWYt9gg');

const PaymentForm = ({amount, orderId, onSuccess}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const {RenderError, showError} = useError();

  const cardElementOptions = {
    style: {
      base: {
        color: '#0f172a',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#94a3b8'
        }
      }, invalid: {
        color: '#dc2626', iconColor: '#dc2626'
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const paymentResponse = await initializePayment(orderId);
      const clientSecretString = paymentResponse?.clientSecret || paymentResponse?.data?.clientSecret;

      if (!clientSecretString) {
        throw new Error('Failed to retrieve payment authorization from server.');
      }

      const {error: stripeError, paymentIntent} = await stripe.confirmCardPayment(clientSecretString, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === 'succeeded') {
        await updatePaymentStatus(orderId, 'COMPLETED');
        onSuccess(paymentIntent);
      } else {
        await updatePaymentStatus(orderId, 'FAILED');
        throw new Error("Payment was not successful. Please try again.");
      }
    } catch (error) {
      showError(error.message || "An unexpected error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  return (<form onSubmit={handleSubmit} className="payment-form">
    {RenderError}
    <div className="stripe-card-wrapper">
      <CardElement options={cardElementOptions}/>
    </div>
    <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary pay-button">{loading ? 'Processing...' : `Pay $${Number(amount).toFixed(2)}`}
    </button>
  </form>);
};

const ProcessPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {RenderError, showError} = useError();

  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderDetails, setOrderDetails] = useState({orderId: '', amount: 0});

  useEffect(() => {
    const orderId = searchParams.get('orderid');
    const amount = searchParams.get('amount');

    if (!orderId || !amount) {
      showError('Missing critical order information in URL.');
      return;
    }

    if (isNaN(amount)) {
      showError('Invalid amount specified.');
      return;
    }

    setOrderDetails({orderId, amount});
  }, [searchParams]);

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentCompleted(true)
    setTimeout(() => {
      navigate('/orders');
    }, 3000);
  };

  if (paymentCompleted) {
    return (<div className="checkout-container">
      <div className="payment-success-card">
        <div className="success-icon">✓</div>
        <h2 className="success-title">Payment Successful</h2>
        <p className="success-message">Thank you for your purchase. Your order
          (<strong>#{orderDetails.orderId}</strong>) is now being processed.</p>
        <p className="success-submessage">A receipt will be sent to your email shortly.</p>
        <button onClick={() => navigate('/orders')} className="btn-secondary mt-4">View Order History</button>
      </div>
    </div>);
  }

  return (<div className="checkout-container">
    {RenderError}
    <div className="payment-card">
      <div className="payment-header">
        <h1 className="payment-title">Secure Checkout</h1>
        <p className="payment-subtitle">Order #{orderDetails.orderId}</p>
      </div>
      <div className="payment-amount-display">
        <span className="amount-label">Total to Pay</span>
        <span className="amount-value">${Number(orderDetails.amount).toFixed(2)}</span>
      </div>
      <Elements stripe={stripeInstance}>
        <PaymentForm
            amount={orderDetails.amount}
            orderId={orderDetails.orderId}
            onSuccess={handlePaymentSuccess}/>
      </Elements>
      <div className="secure-badge">
        🔒 Payments are securely encrypted and processed by Stripe.
      </div>
    </div>
  </div>);
};

export default ProcessPaymentPage;