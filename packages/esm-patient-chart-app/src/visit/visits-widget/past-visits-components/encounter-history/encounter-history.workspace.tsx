import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { formatDatetime } from '@openmrs/esm-framework';
import { EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useEncounterObservations } from './encounter-history.resource';
import styles from './encounter-history.scss';

type EncounterHistoryWorkspaceProps = {
  encounterUuid: string;
};

// 🧮 Mock observation data (for PoC)
const mockObservations = [
  {
    date: new Date('2025-09-05T15:45:00Z'),
    modifiedBy: 'Dr. Smith',
    question: 'Blood Pressure',
    answer: '120/80 mmHg',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-12T11:45:00Z'),
    modifiedBy: 'Nurse Emma',
    question: 'Heart Rate',
    answer: '82 bpm',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-13T10:20:00Z'),
    modifiedBy: 'Dr. Patel',
    question: 'Oxygen Saturation',
    answer: '97%',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-14T14:15:00Z'),
    modifiedBy: 'Dr. Kim',
    question: 'Temperature',
    answer: '37.2 °C',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-15T08:10:00Z'),
    modifiedBy: 'Dr. Smith',
    question: 'Blood Pressure',
    answer: '124/84 mmHg',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-16T12:30:00Z'),
    modifiedBy: 'Nurse Emma',
    question: 'Respiratory Rate',
    answer: '18 bpm',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-17T09:00:00Z'),
    modifiedBy: 'Dr. Patel',
    question: 'Heart Rate',
    answer: '78 bpm',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-18T10:25:00Z'),
    modifiedBy: 'Dr. Kim',
    question: 'Weight',
    answer: '70 kg',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-19T15:45:00Z'),
    modifiedBy: 'Nurse Emma',
    question: 'Weight',
    answer: '69.5 kg',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-20T13:00:00Z'),
    modifiedBy: 'Dr. Patel',
    question: 'Temperature',
    answer: '37.8 °C',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-21T09:40:00Z'),
    modifiedBy: 'Dr. Smith',
    question: 'Oxygen Saturation',
    answer: '-',
    modification: 'Remove',
  },
  {
    date: new Date('2025-09-22T10:05:00Z'),
    modifiedBy: 'Nurse Emma',
    question: 'Respiratory Rate',
    answer: '-',
    modification: 'Remove',
  },
];

const EncounterHistoryWorkspace: React.FC<EncounterHistoryWorkspaceProps> = ({ encounterUuid }) => {
  const { t } = useTranslation();
  const { observations, isLoading, error } = useEncounterObservations(encounterUuid);

  // Use mock data for now if hook is empty
  // const data = observations && observations.length > 0 ? observations : mockObservations;
  const data = mockObservations;

  const tableRows = useMemo(
    () =>
      data.map((obs, index) => ({
        id: `${index}`,
        date: formatDatetime(obs.date, { mode: 'standard' }),
        modifiedBy: obs.modifiedBy,
        question: obs.question,
        answer: obs.answer,
        modification: obs.modification,
      })),
    [data],
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>{t('loading', 'Loading…')}</p>
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} headerTitle={t('encounterHistoryError', 'Encounter History Error')} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        headerTitle={t('noObservationsFound', 'No Observations Found')}
        displayText={t('observations', 'Observations')}
      />
    );
  }

  const tableHeaders = [
    { key: 'date', header: t('date', 'Date') },
    { key: 'modification', header: t('action', 'Action') },
    { key: 'modifiedBy', header: t('by', 'By') },
    { key: 'question', header: t('question', 'Question') },
    { key: 'answer', header: t('answer', 'Answer') },
  ];

  return (
    <DataTable rows={tableRows} headers={tableHeaders} isSortable useZebraStyles>
      {({ rows, headers, getHeaderProps, getTableProps }) => (
        <TableContainer>
          <Table {...getTableProps()} size="sm">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value ?? '-'}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
};

export default EncounterHistoryWorkspace;
