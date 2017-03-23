export class Week {
    readonly minutesInHour: number = 60;
    readonly standardWeeklyTimeMM: number = 2160;
    readonly standardWeeklyTime: number = this.standardWeeklyTimeMM / this.minutesInHour;

    public weeklyCases: any[][];
    public weeklyCasesImagesQC: any[][];
    public weeklyCasesCE: any[][];
    public weeklyCasesQE: any[][];

    public weeklyTimeMM: any[];
    public weeklyTimeImagesQCMM: any[];
    public weeklyTimeCEMM: any[];
    public weeklyTimeQEMM: any[];

    public totalWeeklyTimeMM: number;
    public totalWeeklyTimeImagesQC: number;
    public totalWeeklyTimeCEMM: number;
    public totalWeeklyTimeQEMM: number;

    public date: Date;
    /**
     *
     */
    constructor(date: Date) {
        this.weeklyCases = [[], [], [], [], [], [], []];
        this.weeklyCasesImagesQC = [[], [], [], [], [], [], []];
        this.weeklyCasesCE = [[], [], [], [], [], [], []];
        this.weeklyCasesQE = [[], [], [], [], [], [], []];

        this.weeklyTimeMM = [0, 0, 0, 0, 0, 0, 0];
        this.weeklyTimeImagesQCMM = [0, 0, 0, 0, 0, 0, 0];
        this.weeklyTimeCEMM = [0, 0, 0, 0, 0, 0, 0];
        this.weeklyTimeQEMM = [0, 0, 0, 0, 0, 0, 0];

        this.totalWeeklyTimeMM = 0;
        this.totalWeeklyTimeImagesQC = 0;
        this.totalWeeklyTimeCEMM = 0;
        this.totalWeeklyTimeQEMM = 0;

        this.date = date;
    }

}