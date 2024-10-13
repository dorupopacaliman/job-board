import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';

type JobListingCheckoutFormProps = {
  amount: number;
};

export const JobListingCheckoutForm = ({ amount }: JobListingCheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/jobs/order-complete`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={onSubmit}>
      {errorMessage && <p className="text-red-500 dark:text-red-900 text-sm mb-4">{errorMessage}</p>}
      <PaymentElement />
      <Button className="mt-4 w-full" type="submit" disabled={isLoading || !stripe || !elements}>
        Pay {formatCurrency(amount)}
      </Button>
    </form>
  );
};
