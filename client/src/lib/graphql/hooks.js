import { useMutation, useQuery } from "@apollo/client";
import { allJobsQuery, companyByIdQuery, createJobMutation, jobByIdQuery } from "./queries";

export function useCompany(id) {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id },
  });

  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJob(id) {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: { id },
  });

  return { job: data?.job, loading, error: Boolean(error) };
}

export function useJobs() {
  const { data, loading, error } = useQuery(allJobsQuery, { fetchPolicy: "network-only" });

  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export function useCreateJobs() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async (title, description) => {
    const {
      data: { job },
    } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    return job;
  };

  return { loading, createJob };
}
