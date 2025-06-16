export type SmokeFreeStatsProps = {
    plan: {
        id: string;
        created_at: string;
    };
    records: any[];
    loading: boolean;
    avgPricePerPack?: number;
    cigarettesPerPack?: number;
};