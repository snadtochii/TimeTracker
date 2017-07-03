export interface DataToChart{
    data: ChartData[];
    date: Date;
    labels: string[];
}
export interface ChartData{
    data: number[],
    label: string
}