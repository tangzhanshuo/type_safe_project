import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentAddCourseMessage extends StudentMessage {
    courseID: number;
    Priority: number;

    constructor(courseID: number, Priority: number) {
        super();
        this.courseID = courseID;
        this.Priority = Priority;
    }
}
