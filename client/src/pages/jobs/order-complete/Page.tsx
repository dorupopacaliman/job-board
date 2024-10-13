import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Await, useDeferredLoaderData } from '@/lib/reactRouter';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { loader } from './loader';

export const OrderCompletePage = () => {
  const { messagePromise } = useDeferredLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center">
      <PageHeader
        subtitle={
          <Suspense fallback="Your payment is processing">
            <Await resolve={messagePromise}>{message => message}</Await>
          </Suspense>
        }
      >
        Order Complete
      </PageHeader>
      <Button asChild>
        <Link to="/jobs/my-listings">View Your Job Listings</Link>
      </Button>
    </div>
  );
};
