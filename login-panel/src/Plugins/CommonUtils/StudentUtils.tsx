import { API } from 'Plugins/CommonUtils/API'
import Auth from 'Plugins/CommonUtils/AuthState'
import {
    Application,
    Approver,
    Course,
    sendCourseListRequest,
    sendPostRequest,
} from 'Plugins/CommonUtils/SendPostRequest'

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


export const sendStudentCourseListRequest = async (message: API) => {
    const response = await sendCourseListRequest(message);

    if (!response.isError && Array.isArray(response.data)) {
        const { username } = Auth.getState();

        const studentCourseList: StudentCourse[] = response.data.map((courseData: Course) => {
            let studentStatus: 'NotEnrolled' | 'Enrolled' | 'Waiting' = 'NotEnrolled';
            if (courseData.enrolledStudents.some(student => student.studentUsername === username)) {
                studentStatus = 'Enrolled';
            } else if (courseData.allStudents.some(student => student.studentUsername === username)) {
                studentStatus = 'Waiting';
            }

            return new StudentCourse(
                courseData.courseid,
                courseData.courseName,
                courseData.teacherName,
                courseData.capacity,
                courseData.credits,
                courseData.info,
                courseData.courseHour,
                courseData.classroomid,
                courseData.enrolledStudents.length,
                courseData.allStudents.length,
                courseData.status,
                studentStatus
            );
        });

        response.data = studentCourseList;
    }
    return response;
};

export const sendApplicationRequest = async (message: API) => {
    const response = await sendPostRequest(message);

    if (!response.isError && response.data) {
        const applicationData = response.data;

        // Convert approver array to Approver objects
        const approvers = applicationData.approver.map((approverData: any) =>
            new Approver(approverData.approved, approverData.username, approverData.usertype)
        );

        // Create a new Application object
        const application = new Application(
            applicationData.applicationID,
            applicationData.usertype,
            applicationData.username,
            applicationData.applicationType,
            applicationData.info,
            approvers,
            applicationData.status
        );

        // Replace the response.data with the new Application object
        response.data = application;
    }
    return response;
};
