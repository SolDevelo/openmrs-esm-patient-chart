import {
  DataTable,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { ErrorState, formatDatetime } from '@openmrs/esm-framework';
import { EmptyState } from '@openmrs/esm-patient-common-lib/src';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEncounterObservations } from './encounter-history.resource';
import styles from './encounter-history.scss';

const mockObservations = [
  // 1️⃣ Blood Pressure (Create + multiple Updates)
  {
    date: new Date('2025-09-05T15:45:00Z'),
    modifiedBy: 'Dr. Smith',
    question: 'Blood Pressure',
    answer: '120/80 mmHg',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-10T08:30:00Z'),
    modifiedBy: 'Dr. Smith',
    question: 'Blood Pressure',
    answer: '122/82 mmHg',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-12T09:15:00Z'),
    modifiedBy: 'Dr. Kim',
    question: 'Blood Pressure',
    answer: '125/85 mmHg',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-15T08:10:00Z'),
    modifiedBy: 'Dr. Smith',
    question: 'Blood Pressure',
    answer: '124/84 mmHg',
    modification: 'Update',
  },

  // 2️⃣ Heart Rate (Create + multiple Updates)
  {
    date: new Date('2025-09-07T11:45:00Z'),
    modifiedBy: 'Nurse Emma',
    question: 'Heart Rate',
    answer: '82 bpm',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-09T13:00:00Z'),
    modifiedBy: 'Dr. Patel',
    question: 'Heart Rate',
    answer: '80 bpm',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-11T16:30:00Z'),
    modifiedBy: 'Dr. Patel',
    question: 'Heart Rate',
    answer: '78 bpm',
    modification: 'Update',
  },

  // 3️⃣ Temperature (Create + Updates + Remove)
  {
    date: new Date('2025-09-14T14:15:00Z'),
    modifiedBy: 'Dr. Kim',
    question: 'Temperature',
    answer: '37.2 °C',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-17T09:30:00Z'),
    modifiedBy: 'Dr. Kim',
    question: 'Temperature',
    answer: '37.5 °C',
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
    date: new Date('2025-09-23T09:10:00Z'),
    modifiedBy: 'Dr. Smith',
    question: 'Temperature',
    answer: '37.8 °C',
    modification: 'Remove',
  },

  // 4️⃣ Weight (Create + Update + Remove)
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
    date: new Date('2025-09-22T10:30:00Z'),
    modifiedBy: 'Dr. Kim',
    question: 'Weight',
    answer: '69.5 kg',
    modification: 'Remove',
  },

  // 5️⃣ Oxygen Saturation (Create + Update + Remove)
  {
    date: new Date('2025-09-09T10:15:00Z'),
    modifiedBy: 'Dr. Patel',
    question: 'Oxygen Saturation',
    answer: '97%',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-11T11:00:00Z'),
    modifiedBy: 'Dr. Patel',
    question: 'Oxygen Saturation',
    answer: '98%',
    modification: 'Update',
  },
  {
    date: new Date('2025-09-21T09:40:00Z'),
    modifiedBy: 'Dr. Smith',
    question: 'Oxygen Saturation',
    answer: '98%',
    modification: 'Remove',
  },

  // 6️⃣ Respiratory Rate (Create + Remove)
  {
    date: new Date('2025-09-16T12:30:00Z'),
    modifiedBy: 'Nurse Emma',
    question: 'Respiratory Rate',
    answer: '18 bpm',
    modification: 'Create',
  },
  {
    date: new Date('2025-09-22T10:05:00Z'),
    modifiedBy: 'Nurse Emma',
    question: 'Respiratory Rate',
    answer: '18 bpm',
    modification: 'Remove',
  },

  // 7️⃣ A single-entry observation (non-expandable)
  {
    date: new Date('2025-09-18T09:00:00Z'),
    modifiedBy: 'Dr. Kim',
    question: 'Blood Glucose',
    answer: '95 mg/dL',
    modification: 'Create',
  },
];

type EncounterHistoryWorkspaceProps = {
  encounterUuid: string;
};

const EncounterHistoryWorkspace: React.FC<EncounterHistoryWorkspaceProps> = ({ encounterUuid }) => {
  const { t } = useTranslation();
  const { observations, isLoading, error } = useEncounterObservations(encounterUuid);

  // For now, use mock data
  const data = mockObservations;

  // Group observations by question
  const groupedData = useMemo(() => {
    const result: Record<string, typeof data> = {};
    data.forEach((obs) => {
      if (!result[obs.question]) result[obs.question] = [];
      result[obs.question].push(obs);
    });
    Object.keys(result).forEach((key) => result[key].sort((a, b) => a.date.getTime() - b.date.getTime()));
    return result;
  }, [data]);

  // Only "Create" as parent rows
  const parentRows = useMemo(() => {
    return Object.values(groupedData)
      .map((group) => group.find((o) => o.modification === 'Create'))
      .filter(Boolean)
      .map((obs) => ({
        id: obs!.question,
        date: formatDatetime(obs!.date, { mode: 'standard' }),
        modification: obs!.modification,
        modifiedBy: obs!.modifiedBy,
        question: obs!.question,
        answer: obs!.answer,
      }));
  }, [groupedData]);

  const headers = [
    { key: 'date', header: t('date', 'Date') },
    { key: 'modification', header: t('action', 'Action') },
    { key: 'modifiedBy', header: t('by', 'By') },
    { key: 'question', header: t('question', 'Question') },
    { key: 'answer', header: t('answer', 'Answer') },
  ];

  if (isLoading) return <DataTableSkeleton role="progressbar" zebra />;
  if (error) return <ErrorState headerTitle={t('encounterHistoryError', 'Encounter History Error')} error={error} />;
  if (!data || data.length === 0)
    return (
      <div className={styles.emptyStateContainer}>
        <EmptyState
          headerTitle={t('noObservationsFound', 'No Observations Found')}
          displayText={t('observations', 'Observations')}
        />
      </div>
    );

  return (
    <div className={styles.container}>
      <DataTable rows={parentRows} headers={headers} size="sm">
        {({ rows, headers, getTableProps, getHeaderProps, getExpandHeaderProps, getRowProps, getExpandedRowProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableExpandHeader enableToggle {...getExpandHeaderProps()} />
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => {
                  const related = groupedData[row.id]?.filter((o) => o.modification !== 'Create') || [];
                  const hasRelated = related.length > 0;

                  // If no related actions: render non-expandable row
                  if (!hasRelated) {
                    return (
                      <TableRow key={row.id}>
                        {/* Placeholder for expand column */}
                        <TableCell />
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    );
                  }

                  // If there are related actions: render expandable row
                  return (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableExpandRow>

                      {row.isExpanded &&
                        related.map((obs, i) => (
                          <TableRow key={`${row.id}-${i}`} className={styles.expandedActionRow}>
                            <TableCell />
                            <TableCell>{formatDatetime(obs.date, { mode: 'standard' })}</TableCell>
                            <TableCell>{obs.modification}</TableCell>
                            <TableCell>{obs.modifiedBy}</TableCell>
                            <TableCell>{obs.question}</TableCell>
                            <TableCell>{obs.answer}</TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};

export default EncounterHistoryWorkspace;
