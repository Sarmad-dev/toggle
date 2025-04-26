import { useQueries } from "@tanstack/react-query";
import { getUserProjectsTimeEntry } from "@/lib/actions/time-entries";
import { getUser } from "@/lib/actions/user";

export const useGetUserProjectsTimeEntries = () => {

  const result = useQueries({
    queries: [
      {
        queryKey: ["user"],
        queryFn: getUser,
        staleTime: Infinity,
      },
      {
        queryKey: ["get-projects-time-entries"],
        queryFn: async () => {
          const user = await getUser(); // Or from queryClient.getQueryData
          return getUserProjectsTimeEntry(user?.id as string);
        },
        enabled: true,
      },
    ],
  });

  const [userQuery, timeEntriesQuery] = result;
  const { isLoading: isUserLoading, data: user } = userQuery;

  const {} = timeEntriesQuery;
  const {
    data: timeEntries,
    isLoading: isTimeEntriesLoading,
    isError: isTimeEntriesError,
    error: timeEntriesError,
  } = timeEntriesQuery;

  return {
    timeEntries,
    isTimeEntriesLoading,
    isUserLoading,
    isTimeEntriesError,
    timeEntriesError,
    refetchTimeEntries: timeEntriesQuery.refetch,
    user,
  }
};
