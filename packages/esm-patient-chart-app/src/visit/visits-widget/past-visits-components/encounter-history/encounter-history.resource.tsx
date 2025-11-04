import { type Obs, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

export function useEncounterObservations(encounterUuid: string) {
  const apiUrl = `${restBaseUrl}/obs?encounter=${encounterUuid}&v=full`;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<Obs> } }, Error>(apiUrl, openmrsFetch);

  return {
    observations: data?.data.results ?? [],
    isLoading,
    error,
  };
}
