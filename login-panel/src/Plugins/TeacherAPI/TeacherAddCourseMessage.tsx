import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherAddCourseMessage extends TeacherMessage {
    courseID: number;
    courseName: string;
    teacherName: string;
    capacity: number;
    info: string;
    courseHourJson: string;
    classroomID: number;
    credits: number;
    allStudentsJson: string;

    constructor(courseID: number, courseName: string, teacherName: string, capacity: number, info: string, courseHourJson: string,
                classroomID: number,
                credits: number,
                allStudentsJson: string) {
        super();
        this.courseID = courseID;
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.info = info;
        this.courseHourJson = courseHourJson;
        this.classroomID = classroomID;
        this.credits = credits;
        this.allStudentsJson = allStudentsJson;
    }
}