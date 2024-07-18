
export class StudentCourse {
    courseid: number;
    courseName: string;
    teacherName: string;
    capacity: number;
    credits: number;
    info: string;
    courseHour: number[];
    classroomid: number;
    enrolledStudentsNumber: number;
    allStudentsNumber: number;
    status: string;
    studentStatus: 'NotEnrolled' | 'Enrolled' | 'Waiting';

    constructor(courseid: number, courseName: string, teacherName: string, capacity: number, credits: number, info: string, courseHour: number[], classroomid: number, enrolledStudentsNumber: number, allStudentsNumber: number, status: string, studentStatus: string) {
        this.courseid = courseid;
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.credits = credits;
        this.info = info;
        this.courseHour = courseHour;
        this.classroomid = classroomid;
        this.enrolledStudentsNumber = enrolledStudentsNumber;
        this.allStudentsNumber = allStudentsNumber;
        this.status = status;
        this.studentStatus = this.parseStudentStatus(studentStatus);
    }

    private parseStudentStatus(studentStatus: string): 'NotEnrolled' | 'Enrolled' | 'Waiting' {
        if (studentStatus == 'NotEnrolled'){
            return 'NotEnrolled'
        }
        if (studentStatus == 'Enrolled'){
            return 'Enrolled'
        }
        if (studentStatus == 'Waiting'){
            return 'Waiting'
        }
        throw new Error(`Unknown student status: ${JSON.stringify(studentStatus)}`);
    }
}

export class StudentWaitingPosition {
    studentCourse: StudentCourse;
    priority: number[];
    position: number;

    constructor(studentCourse: StudentCourse, priority: number[], position: number) {
        this.studentCourse = studentCourse;
        this.priority = priority;
        this.position = position;
    }
}


