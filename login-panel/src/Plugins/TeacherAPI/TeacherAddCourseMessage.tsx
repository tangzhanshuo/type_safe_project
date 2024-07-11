import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherAddCourseMessage extends TeacherMessage {
    courseID: number;
    courseName: string;
    teacherName: string;
    capacity: number;
    info: string;
    courseHourJson: String;
    classroomID: number;
    credits: number;
    kwargsJson: String;

    constructor(courseID: number, courseName: string, teacherName: string, capacity: number, info: string, courseHourJson: String,
                classroomID: number,
                credits: number,
                kwargsJson: String) {
        super();
        this.courseID = courseID;
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