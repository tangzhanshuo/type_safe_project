import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentGetCourseMessage extends StudentMessage {
    courseID: number;

    constructor(courseID: number) {
        super();
        this.courseID = courseID;
    }
}
