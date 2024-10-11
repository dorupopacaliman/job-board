import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Banknote, CalendarDays, GraduationCap } from 'lucide-react';
import { JobListingGrid } from './JobListingGrid';

export const JobListingSkeletonCard = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex gap-1 flex-col">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
        <div className="flex gap-1 flex-wrap">
          <Badge variant="secondary" className="animate-pulse">
            <Banknote className="w-4 h-4" />
            <div className="w-8" />
          </Badge>
          <Badge variant="secondary" className="animate-pulse">
            <CalendarDays className="w-4 h-4" />
            <div className="w-8" />
          </Badge>
          <Badge variant="secondary" className="animate-pulse">
            <GraduationCap className="w-4 h-4" />
            <div className="w-8" />
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="gap-1 flex-col flex">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
};

export const JobListingSkeletonGrid = ({ amount = 6 }) => {
  return (
    <JobListingGrid>
      {Array.from({ length: amount }).map((_, index) => (
        <JobListingSkeletonCard key={index} />
      ))}
    </JobListingGrid>
  );
};
