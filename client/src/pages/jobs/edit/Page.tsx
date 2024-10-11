import { PageHeader } from '@/components/ui/PageHeader';
import { editJobListing, JobListingForm } from '@/features/job-listing';
import { Await, useDeferredLoaderData } from '@/lib/reactRouter';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { loader } from './loader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const EditJobListingPage = () => {
  const navigate = useNavigate();
  const { id, jobListingPromise } = useDeferredLoaderData<typeof loader>();

  return (
    <>
      <PageHeader>Edit Listings</PageHeader>
      <Suspense fallback={<LoadingSpinner className="w-24 h-24" />}>
        <Await resolve={jobListingPromise}>
          {(jobListing) => (
            <JobListingForm
              initialJobListing={jobListing}
              onSubmit={async values => {
                await editJobListing(id, values);
                navigate('/jobs/my-listings');
              }}
            />
          )}
        </Await>
      </Suspense>
    </>
  );
};
