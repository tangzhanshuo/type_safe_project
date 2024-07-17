import { StudentMessage } from 'Plugins/StudentAPI/StudentMessage';

export class StudentManualSelectCourseMessage extends StudentMessage {
    courseID: number
    reason: string

    constructor(courseID: number, reason: string) {
        super()
        this.courseID = courseID
        this.reason = reason
    }
}