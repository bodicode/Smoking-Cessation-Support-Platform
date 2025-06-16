import { gql } from "@apollo/client";

export const UPDATE_PROGRESS_RECORD = gql`
  mutation updateProgressRecord($updateProgressRecordInput2: UpdateProgressRecordInput!) {
    updateProgressRecord(input: $updateProgressRecordInput2) {
      id
      cigarettes_smoked
      health_score
      notes
      record_date
    }
  }
`;