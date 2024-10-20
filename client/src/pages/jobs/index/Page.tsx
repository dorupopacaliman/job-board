import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import {
  JobListingCard,
  JobListingFilterForm,
  JobListingFullDialog,
  JobListingGrid,
  JobListingSkeletonGrid,
  useJobListingFilterForm,
} from '@/features/job-listing';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Await, useDeferredLoaderData } from '@/lib/reactRouter';
import { cn } from '@/utils/shadcnUtils';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { loader } from './loader';

export const JobListingsListPage = () => {
  const { jobListingsPromise } = useDeferredLoaderData<typeof loader>();
  const [hiddenJobListingIds, setHiddenJobListingIds] = useLocalStorage<string[]>('hiddenJobsIds', []);
  const [favoriteJobListingIds, setFavoriteJobListingIds] = useLocalStorage<string[]>('favoriteJobsIds', []);
  const { form, getFilteredJobs } = useJobListingFilterForm();

  const toggleFavorite = (id: string) => {
    setFavoriteJobListingIds(prevIds => (prevIds.includes(id) ? prevIds.filter(id => id !== id) : [...prevIds, id]));
  };

  const toggleHidden = (jobListingId: string, title: string) => {
    setHiddenJobListingIds(ids =>
      ids.includes(jobListingId) ? ids.filter(id => id !== jobListingId) : [...ids, jobListingId]
    );

    if (!hiddenJobListingIds.includes(jobListingId)) {
      toast({
        title: 'Job Hidden',
        description: `${title} will no longer be shown`,
        action: (
          <ToastAction
            onClick={() => {
              setHiddenJobListingIds(ids => ids.filter(id => id !== jobListingId));
            }}
            altText="Click show hidden in the filter section to show hidden jobs and then click the show button in the card to show this job again"
          >
            Undo
          </ToastAction>
        ),
      });
    }
  };

  return (
    <>
      <PageHeader
        btnSection={
          <Button variant="outline" asChild>
            <Link to="/jobs/new">Create Listing</Link>
          </Button>
        }
      >
        Job Listings
      </PageHeader>
      <JobListingFilterForm className="mb-12" form={form} />
      <Suspense fallback={<JobListingSkeletonGrid amount={6} />}>
        <Await resolve={jobListingsPromise}>
          {jobListings => (
            <JobListingGrid>
              {getFilteredJobs(jobListings, hiddenJobListingIds, favoriteJobListingIds).map(jobListing => {
                const isHidden = hiddenJobListingIds.includes(jobListing.id);
                const isFavorite = favoriteJobListingIds.includes(jobListing.id);
                const HiddenIcon = isHidden ? Eye : EyeOff;

                return (
                  <JobListingCard
                    className={isHidden ? 'opacity-50' : undefined}
                    key={jobListing.id}
                    {...jobListing}
                    footerBtns={<JobListingFullDialog {...jobListing} />}
                    headerDetails={
                      <div className="-mr-3 -mt-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full"
                          onClick={() => toggleHidden(jobListing.id, jobListing.title)}
                        >
                          <HiddenIcon className="w-4 h-4" />
                          <span className="sr-only">{isHidden ? 'Show' : 'Hide'}</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full"
                          onClick={() => toggleFavorite(jobListing.id)}
                        >
                          <Heart className={cn('w-4 h-4', isFavorite && 'fill-red-500 stroke-red-500')} />
                          <span className="sr-only">{isFavorite ? 'Un-Favorite' : 'Favorite'}</span>
                        </Button>
                      </div>
                    }
                  />
                );
              })}
            </JobListingGrid>
          )}
        </Await>
      </Suspense>
    </>
  );
};
