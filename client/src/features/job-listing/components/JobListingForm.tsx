import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { jobListingFormSchema } from '@backend/constants/schemas/jobListings';
import { JOB_LISTING_EXPERIENCE_LEVELS, JOB_LISTING_TYPES } from '@backend/constants/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Control, FieldValues, Path, PathValue, useForm } from 'react-hook-form';
import { z } from 'zod';
import { JobListingCard } from './JobListingCard';
import { JobListingFullDialog } from './JobListingFullDialog';
import { JobListingGrid } from './JobListingGrid';

type JobListingValues = z.infer<typeof jobListingFormSchema>;

const DEFAULT_VALUES: JobListingValues = {
  title: '',
  companyName: '',
  location: '',
  applyUrl: '',
  type: 'Full Time',
  experienceLevel: 'Mid-Level',
  salary: NaN,
  shortDescription: '',
  description: '',
};

type JobListingFormProps = {
  onSubmit: (values: JobListingValues) => Promise<void>;
  initialJobListing?: JobListingValues;
};

export const JobListingForm = ({ onSubmit, initialJobListing = DEFAULT_VALUES }: JobListingFormProps) => {
  const form = useForm<JobListingValues>({
    resolver: zodResolver(jobListingFormSchema),
    defaultValues: initialJobListing,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const jobListingValues = form.watch();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applyUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application URL</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <JobListingSelectFormField control={form.control} name="type" label="Type" options={JOB_LISTING_TYPES} />
            <JobListingSelectFormField
              control={form.control}
              name="experienceLevel"
              label="Experience Level"
              options={JOB_LISTING_EXPERIENCE_LEVELS}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                      value={isNaN(field.value) ? '' : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Max 200 characters</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Supports full Markdown</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsPreviewOpen(prev => !prev)}>
              {isPreviewOpen ? 'Close Preview' : 'Show Preview'}
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <LoadingSpinner /> : 'Save'}
            </Button>
          </div>
        </form>
      </Form>

      {isPreviewOpen && (
        <JobListingGrid className="mt-12">
          <JobListingCard {...jobListingValues} footerBtns={<JobListingFullDialog {...jobListingValues} />} />
        </JobListingGrid>
      )}
    </>
  );
};

type JobListingSelectFormFieldProps<T extends FieldValues> = {
  label: string;
  control: Control<T>;
  name: Path<T>;
  options: readonly PathValue<T, Path<T>>[];
};

const JobListingSelectFormField = <T extends FieldValues>({
  label,
  control,
  name,
  options,
}: JobListingSelectFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={val => field.onChange(val as PathValue<T, Path<T>>)} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {options.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormDescription>Supports full Markdown</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
