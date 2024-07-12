import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentAddCourseMessage extends StudentMessage {
    courseID: number;
    priority: number;

    constructor(courseID: number, priority: number) {
        super();
        this.courseID = courseID;
        this.priority = priority;
    }
}
