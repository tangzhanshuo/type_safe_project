import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherAddCourseMessage extends TeacherMessage {
    courseName: string;
    teacherName: string;
    capacity: number;
    info: string;
    courseHourJson: String;
    classroomID: number;
    credits: number;
    kwargsJson: String;

    constructor(courseName: string, teacherName: string, capacity: number, info: string, courseHourJson: String,
                classroomID: number,
                credits: number,
                kwargsJson: String) {
        super();
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.info = info;
        this.courseHourJson = courseHourJson;
        this.classroomID = classroomID;
        this.credits = credits;
        this.kwargsJson = kwargsJson;
    }
}