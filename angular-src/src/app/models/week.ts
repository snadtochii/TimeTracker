export class Week {
    readonly minutesInHour: number = 60;
    readonly standardWeeklyTimeMM: number = 2400;
    readonly standardWeeklyTime: number = this.standardWeeklyTimeMM / this.minutesInHour;

    public weeklyTimeMM: any[];
    public weeklyTimeImagesQCMM: any[];
    public weeklyTimeCEMM: any[];
    public weeklyTimeQEMM: any[];
    public weeklyTimeOblCEMM: any[];
    public weeklyTimeOblQEMM: any[];
    public totalWeeklyTimeMM: number;

    constructor() { }

}