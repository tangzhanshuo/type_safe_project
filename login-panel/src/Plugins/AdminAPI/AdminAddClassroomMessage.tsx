import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddClassroomMessage extends AdminMessage {
    classroomID: number;
    classroomName: string;
    enrolledCoursesJson: string; // JSON represented as String

    constructor(
        classroomID: number,
        classroomName: string,
        enrolledCoursesJson: string
    ) {
        super();
        this.classroomID = classroomID;
        this.classroomName = classroomName;
        this.enrolledCoursesJson = enrolledCoursesJson;
    }
}
