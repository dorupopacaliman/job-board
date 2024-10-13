import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { stripePromise } from '@/lib/stripe';
import { formatCurrency } from '@/utils/formatters';
import { JOB_LISTING_DURATIONS } from '@backend/constants/types';
import { getJobListingPriceInCents } from '@backend/utils/getJobListingPriceInCents';
import { Elements } from '@stripe/react-stripe-js';
import { differenceInDays, formatDistanceStrict, isAfter } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { JobListing } from '../constants/types';
import { createPublishPaymentIntent, deleteListing } from '../services/jobListing';
import { JobListingCard } from './JobListingCard';
import { JobListingCheckoutForm } from './JobListingCheckoutForm';
import { JobListingGrid } from './JobListingGrid';

type MyJobListingProps = {
  jobListings: JobListing[];
};

export const MyJobListingGrid = ({ jobListings }: MyJobListingProps) => {
  const [deletedJobListingIds, setDeletedJobListingIds] = useState<string[]>([]);

  const visibleJobListings = useMemo(
    () => jobListings.filter(jobListing => !deletedJobListingIds.includes(jobListing.id)).sort(sortJobListings),
    [jobListings, deletedJobListingIds]
  );

  const deleteJobListing = useCallback(async (id: string) => {
    try {
      await deleteListing(id);
      setDeletedJobListingIds(prev => [...prev, id]);
    } catch (error) {
      toast({
        title: 'Failed to delete job listing',
        action: (
          <ToastAction altText="Retry" onClick={() => deleteJobListing(id)}>
            Retry
          </ToastAction>
        ),
      });
    }
  }, []);

  return (
    <JobListingGrid>
      {visibleJobListings.map(jobListing => (
        <MyJobListingCard key={jobListing.id} jobListing={jobListing} deleteJobListing={deleteJobListing} />
      ))}
    </JobListingGrid>
  );
};

type MyJobListingCardProps = {
  jobListing: JobListing;
  deleteJobListing: (id: string) => void;
};

const MyJobListingCard = ({ jobListing, deleteJobListing }: MyJobListingCardProps) => {
  const [selectedDuration, setSelectedDuration] = useState<(typeof JOB_LISTING_DURATIONS)[number] | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const status = getJobListingStatus(jobListing.expiresAt);
  const { isDark } = useTheme();

  return (
    <JobListingCard
      {...jobListing}
      headerDetails={
        <div>
          <Badge className="rounded" variant={getJobListingBadgeVariant(status)}>
            {status}
            {status === 'Active' && jobListing.expiresAt && ` ${getDaysRemainingText(jobListing.expiresAt)}`}
          </Badge>
        </div>
      }
      footerBtns={
        <>
          <DeleteJobListingDialog deleteListing={() => deleteJobListing(jobListing.id)} />
          <Button variant="outline" asChild>
            <Link to={`/jobs/${jobListing.id}/edit`}>Edit</Link>
          </Button>
          <Dialog
            open={selectedDuration != null}
            onOpenChange={isOpen => {
              if (isOpen) return;
              setSelectedDuration(null);
              setClientSecret(null);
            }}
          >
            <DialogContent>
              <DialogTitle>
                {getPurchaseButtonText(status)} {jobListing.title} for {selectedDuration} days
              </DialogTitle>
              <DialogDescription>This is a non-refundable purchase</DialogDescription>
              {clientSecret && selectedDuration && (
                <Elements
                  options={{ clientSecret, appearance: { theme: isDark ? 'night' : 'stripe' } }}
                  stripe={stripePromise}
                >
                  <JobListingCheckoutForm amount={getJobListingPriceInCents(selectedDuration) / 100} />
                </Elements>
              )}
            </DialogContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>{getPurchaseButtonText(status)}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {JOB_LISTING_DURATIONS.map(duration => (
                  <DropdownMenuItem
                    onClick={async () => {
                      setSelectedDuration(duration);
                      const { clientSecret } = await createPublishPaymentIntent(jobListing.id, duration);
                      setClientSecret(clientSecret);
                    }}
                    className="capitalize"
                    key={duration}
                  >
                    {duration} Days - {formatCurrency(getJobListingPriceInCents(duration) / 100)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        </>
      }
    />
  );
};

type DeleteJobListingDialogProps = {
  deleteListing: () => void;
};

const DeleteJobListingDialog = ({ deleteListing }: DeleteJobListingDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this job listing?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your job listing and any remaining time will not
            be refunded.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteListing}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const getJobListingStatus = (expiresAt: Date | null) => {
  if (expiresAt == null) {
    return 'Draft';
  } else if (isAfter(expiresAt, new Date())) {
    return 'Active';
  } else {
    return 'Expired';
  }
};

const getDaysRemainingText = (expiresAt: Date) => {
  return `${formatDistanceStrict(expiresAt, new Date(), { unit: 'day' })} left`;
};

const getPurchaseButtonText = (status: ReturnType<typeof getJobListingStatus>) => {
  switch (status) {
    case 'Draft':
      return 'Publish';
    case 'Active':
      return 'Extend';
    case 'Expired':
      return 'Republish';
  }
};

const getJobListingBadgeVariant = (status: ReturnType<typeof getJobListingStatus>) => {
  switch (status) {
    case 'Draft':
      return 'secondary';
    case 'Active':
      return 'default';
    case 'Expired':
      return 'destructive';
  }
};

const sortJobListings = (a: JobListing, b: JobListing) => {
  if (a.expiresAt === b.expiresAt) {
    return 0;
  } else if (a.expiresAt == null) {
    return -1;
  } else if (b.expiresAt == null) {
    return 1;
  } else {
    return differenceInDays(a.expiresAt, b.expiresAt);
  }
};
