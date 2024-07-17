import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from 'Plugins/CommonUtils/ThemeContext'  // Import ThemeProvider
import { Main } from 'Pages/Main'
import { Register } from 'Pages/Register'
import { Login } from 'Pages/Login'
import { StudentCourseList } from 'Pages/Student/StudentCourseList'
import { StudentCourseDetail } from 'Pages/Student/StudentCourseDetail'
import { TeacherDashboard } from 'Pages/Teacher/TeacherDashboard'
import { AdminUserManagement } from 'Pages/Admin/AdminUserManagement'
import { AdminAddCourse } from 'Pages/Admin/AdminAddCourse'
import { AdminSearchCourse } from 'Pages/Admin/AdminSearchCourse'
import { AdminCourseDetail } from 'Pages/Admin/AdminCourseDetail'
import { TeacherCourseDetail } from 'Pages/Teacher/TeacherCourseDetail'
import { TeacherCourseList } from "Pages/Teacher/TeacherCourseList"
import { TeacherAddCourse } from "Pages/Teacher/TeacherAddCourse"
import { TeacherMyCourse } from "Pages/Teacher/TeacherMyCourse"
import { AdminApplication } from 'Pages/Admin/AdminApplication'
import { StudentDashboard } from 'Pages/Student/StudentDashboard'
import { StudentMyCourse } from 'Pages/Student/StudentMyCourse'
import { AdminDashboard } from 'Pages/Admin/AdminDashboard'
import {AdminClassroom} from "Pages/Admin/AdminClassroom";
import { NotFoundPage } from 'Pages/NotFoundPage'


const Layout = () => {
    return (
        <ThemeProvider>  {/* Wrap everything with ThemeProvider */}
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/register/:usertype" exact component={Register} />
                    <Route path="/login/:usertype" exact component={Login} />
                    <Route path="/student/myCourse" exact component={StudentMyCourse} />
                    <Route path="/student/courseList" exact component={StudentCourseList} />
                    <Route path="/student/dashboard" exact component={StudentDashboard} />
                    <Route path="/student/course/:courseid(\d+)" component={StudentCourseDetail} />
                    <Route path="/teacher/dashboard" exact component={TeacherDashboard} />
                    <Route path="/teacher/course/:courseid(\d+)" exact component={TeacherCourseDetail} />
                    <Route path="/teacher/addCourse" exact component={TeacherAddCourse} />
                    <Route path="/teacher/myCourse" exact component={TeacherMyCourse} />
                    <Route path="/teacher/courseList" exact component={TeacherCourseList} />
                    <Route path="/admin/dashboard" exact component={AdminDashboard} />
                    <Route path="/admin/userManagement" exact component={AdminUserManagement} />
                    <Route path="/admin/classroom" exact component={AdminClassroom} />
                    <Route path="/admin/course/addCourse" exact component={AdminAddCourse} />
                    <Route path="/admin/course/searchCourse" exact component={AdminSearchCourse} />
                    <Route path="/admin/course/searchCourse/:courseid(\d+)" exact component={AdminCourseDetail} />
                    <Route path="/admin/application" exact component={AdminApplication} />
                    <Route component={NotFoundPage} />
                </Switch>
            </HashRouter>
        </ThemeProvider>
    )
}

render(<Layout />, document.getElementById('root'))
