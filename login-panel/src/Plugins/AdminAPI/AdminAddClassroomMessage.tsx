import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminAddClassroomMessage extends AdminMessage {
    classroomid: number;
    classroomName: string;
    capacity: number;
    enrolledCoursesJson: string;

    constructor(classroomid: number, classroomName: string, capacity: number, enrolledCoursesJson: string) {
        super();
        this.classroomid = classroomid;
        this.classroomName = classroomName;
        this.capacity = capacity;
        this.enrolledCoursesJson = enrolledCoursesJson;
    }
}
