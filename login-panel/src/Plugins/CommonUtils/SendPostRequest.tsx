import axios, { isAxiosError } from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import Auth from 'Plugins/CommonUtils/AuthState';

export class Response {
    isError: boolean;
    error: any;
    data: any;

    constructor() {
        this.isError = false;
        this.error = null;
        this.data = null;
    }
}

export class CourseStudent {
    studentUsername: string;
    priority: number;
    time: number;

    constructor(studentUsername: string, priority: number, time: number) {
        this.studentUsername = studentUsername;
        this.priority = priority;
        this.time = time;
    }
}

export class Course {
    courseid: number;
    courseName: string;
    teacherName: string;
    capacity: number;
    credits: number;
    info: string;
    courseHour: number[];
    classroomid: number;
    enrolledStudents: CourseStudent[];
    allStudents: CourseStudent[];
    status: string; // New status field

    constructor(courseid: number, courseName: string, teacherName: string, capacity: number, credits: number, info: string, courseHour: number[], classroomid: number, enrolledStudents: CourseStudent[], allStudents: CourseStudent[], status: string) {
        this.courseid = courseid;
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.capacity = capacity;
        this.credits = credits;
        this.info = info;
        this.courseHour = courseHour;
        this.classroomid = classroomid;
        this.enrolledStudents = enrolledStudents;
        this.allStudents = allStudents;
        this.status = status; // Initialize the new status field
    }
}

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



export class Approver {
    approved: boolean;
    username: string;
    usertype: 'admin' | 'teacher' | 'student';

    constructor(approved: boolean, username: string, usertype: 'admin' | 'teacher' | 'student') {
        this.approved = approved;
        this.username = username;
        this.usertype = usertype;
    }
}

export class Application {
    applicationID: string;
    usertype: string;
    username: string;
    applicationType: string;
    info: string;
    approver: Approver[];
    status: string;

    constructor(
        applicationID: string,
        usertype: string,
        username: string,
        applicationType: string,
        info: string,
        approver: Approver[],
        status: string
    ) {
        this.applicationID = applicationID;
        this.usertype = usertype;
        this.username = username;
        this.applicationType = applicationType;
        this.info = info;
        this.approver = approver;
        this.status = status;
    }
}

export class Classroom {
    classroomid: number;
    classroomName: string;
    capacity: number;
    enrolledCourses: Map<number, number[]>;

    constructor(
        classroomid: number,
        classroomName: string,
        capacity: number,
        enrolledCourses: Map<number, number[]>
    ) {
        this.classroomid = classroomid;
        this.classroomName = classroomName;
        this.capacity = capacity;
        this.enrolledCourses = enrolledCourses;
    }
}


export const sendUnverifiedPostRequest = async (message: API) => {
    const returnResponse = new Response()
    try {
        const response = await axios.post(message.getURL(), JSON.stringify(message), {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', response.status);
        console.log('Response data type:', typeof response.data)
        console.log('Response body:', response.data);
        returnResponse.data = response.data
    } catch (error) {
        returnResponse.isError = true;
        if (isAxiosError(error)) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error;
                const index = errorMessage.toLowerCase().lastIndexOf("body:");
                const errorString = index !== -1 ? errorMessage.substring(index + 5).trim() : errorMessage;
                console.error('Error sending request:', errorMessage);
                console.error('Error string:', errorString);
                returnResponse.error = errorString
            } else {
                console.error('Error sending request:', error.message);
                returnResponse.error = error.message
            }
        } else {
            console.error('Unexpected error:', error);
        }
    }
    return returnResponse
};

export const sendPostRequest = async (message: API) => {
    const response = await sendUnverifiedPostRequest(message)
    if (response.isError && response.error === 'Invalid user') {
        const { setUsertype, setUsername, setToken } = Auth.getState();
        setUsertype('');
        setUsername('');
        setToken('');
    }
    return response
};

export const sendCourseRequest = async (message: API) => {
    const response = await sendPostRequest(message);

    if (!response.isError && response.data) {
        const courseData = response.data;

        // Convert enrolledStudents and allStudents to CourseStudent objects
        const convertToCourseStudent = (student: any): CourseStudent => {
            return new CourseStudent(student.studentUsername, student.priority, student.time);
        };

        const enrolledStudents = courseData.enrolledStudents.map(convertToCourseStudent);
        const allStudents = courseData.allStudents.map(convertToCourseStudent);

        // Create a new Course object
        const course = new Course(
            courseData.courseid,
            courseData.courseName,
            courseData.teacherName,
            courseData.capacity,
            courseData.credits,
            courseData.info,
            courseData.courseHour,
            courseData.classroomid,
            enrolledStudents,
            allStudents,
            courseData.status || '' // Include the new status field, default to empty string if not provided
        );

        // Replace the response.data with the new Course object
        response.data = course;
    }
    return response;
};

export const sendCourseListRequest = async (message: API) => {
    const response = await sendPostRequest(message);

    if (!response.isError && Array.isArray(response.data)) {
        // Convert each course in the response to a Course object
        const courseList: Course[] = response.data.map((courseData: any) => {
            // Convert enrolledStudents and allStudents to CourseStudent objects
            const convertToCourseStudent = (student: any): CourseStudent => {
                return new CourseStudent(student.studentUsername, student.priority, student.time);
            };

            const enrolledStudents = (courseData.enrolledStudents || []).map(convertToCourseStudent);
            const allStudents = (courseData.allStudents || []).map(convertToCourseStudent);

            // Create and return a new Course object
            return new Course(
                courseData.courseid,
                courseData.courseName,
                courseData.teacherName,
                courseData.capacity,
                courseData.credits,
                courseData.info,
                courseData.courseHour,
                courseData.classroomid,
                enrolledStudents,
                allStudents,
                courseData.status || '' // Include the new status field, default to empty string if not provided
            );
        });

        // Replace the response.data with the new array of Course objects
        response.data = courseList;
    }
    return response;
};

export const sendApplicationListRequest = async (message: API) => {
    const response = await sendPostRequest(message);

    if (!response.isError && Array.isArray(response.data)) {
        // Convert each application in the response to an Application object
        const applicationList: Application[] = response.data.map((applicationData: any) => {
            // Convert approver array to Approver objects
            const approvers = applicationData.approver.map((approverData: any) =>
                new Approver(approverData.approved, approverData.username, approverData.usertype)
            );

            // Create and return a new Application object
            return new Application(
                applicationData.applicationID,
                applicationData.usertype,
                applicationData.username,
                applicationData.applicationType,
                applicationData.info,
                approvers,
                applicationData.status
            );
        });

        // Replace the response.data with the new array of Application objects
        response.data = applicationList;
    }
    return response;
};
