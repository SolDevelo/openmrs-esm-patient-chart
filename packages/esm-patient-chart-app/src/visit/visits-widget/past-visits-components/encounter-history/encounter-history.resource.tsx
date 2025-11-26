import { type Obs, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

export function useEncounterObservations(encounterUuid: string) {
  const apiUrl = `${restBaseUrl}/obs?encounter=${encounterUuid}&includeAll=true&v=custom:(uuid,display,voided,auditInfo,concept:(uuid,display))&order=obsDatetime,dateCreated`;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<Obs> } }, Error>(apiUrl, openmrsFetch);

  return {
    observations: data?.data.results ?? [],
    isLoading,
    error,
  };
}
