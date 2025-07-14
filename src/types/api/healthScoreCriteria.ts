export interface Coach {
  id: string;
  name: string;
}

export interface HealthScoreCriteria {
  id: string;
  coach: Coach;
  title: string;
  description: string;
}

export interface GetHealthScoreCriteriaData {
  healthScoreCriteriaByCoach: HealthScoreCriteria[];
}
