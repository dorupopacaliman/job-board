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
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { JobListing } from '../constants/types';
import { deleteListing } from '../services/jobListing';
import { JobListingCard } from './JobListingCard';
import { JobListingGrid } from './JobListingGrid';

type MyJobListingProps = {
  jobListings: JobListing[];
};

export const MyJobListingGrid = ({ jobListings }: MyJobListingProps) => {
  const [deletedJobListingIds, setDeletedJobListingIds] = useState<string[]>([]);

  const visibleJobListings = useMemo(
    () => jobListings.filter(jobListing => !deletedJobListingIds.includes(jobListing.id)),
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
  return (
    <JobListingCard
      {...jobListing}
      footerBtns={
        <>
          <DeleteJobListingDialog deleteListing={() => deleteJobListing(jobListing.id)} />
          <Button variant="outline" asChild>
            <Link to={`/jobs/${jobListing.id}/edit`}>Edit</Link>
          </Button>
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
