import { baseApi } from '@/services/baseApi';
import { jobListingFormSchema } from '@backend/constants/schemas/jobListings';
import { z } from 'zod';
import { jobListingSchema } from '../constants/schemas';

export const createJobListing = async (data: z.infer<typeof jobListingFormSchema>) => {
  return baseApi.post('/job-listings', data).then(res => jobListingFormSchema.parseAsync(res.data));
};

export const getAllMyListings = async () => {
  return baseApi.get('/job-listings/my-listings').then(res => {
    return z.array(jobListingSchema).parseAsync(res.data);
  });
};

export const deleteListing = async (id: string) => {
  return baseApi.delete(`/job-listings/${id}`);
};

export const getJobListing = async (id: string) => {
  return baseApi.get(`/job-listings/${id}`).then(res => jobListingSchema.parseAsync(res.data));
};

export const editJobListing = async (id: string, data: z.infer<typeof jobListingFormSchema>) => {
  return baseApi.put(`/job-listings/${id}`, data).then(res => jobListingFormSchema.parseAsync(res.data));
};
