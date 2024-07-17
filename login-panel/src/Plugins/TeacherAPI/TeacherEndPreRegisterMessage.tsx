import { TeacherMessage } from 'Plugins/TeacherAPI/TeacherMessage'

export class TeacherEndPreRegisterMessage extends TeacherMessage {
    courseID: number;

    constructor(courseID: number) {
        super();
        this.courseID = courseID;
    }
}