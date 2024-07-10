import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddClassroomMessage extends AdminMessage {
    classroomID: number;
    classroomName: string;
    capacity: number;
    enrolledCoursesJson: string;

    constructor(classroomID: number, classroomName: string, capacity: number, enrolledCoursesJson: string) {
        super();
        this.classroomID = classroomID;
        this.classroomName = classroomName;
        this.capacity = capacity;
        this.enrolledCoursesJson = enrolledCoursesJson;
    }
}
