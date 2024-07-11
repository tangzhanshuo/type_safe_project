import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { Login } from 'Pages/Login'
import { StudentMain } from 'Pages/Student/StudentMain'
import { StudentCourse } from 'Pages/Student/StudentCourse'
import { StudentApplication } from 'Pages/Student/StudentApplication'
import { StudentCourseDetail } from 'Pages/Student/StudentCourseDetail'
import { TeacherMain } from 'Pages/Teacher/TeacherMain'
import { AdminMain } from 'Pages/Admin/AdminMain'
import { AdminCourse } from 'Pages/Admin/AdminCourse'
import {TeacherCourseDetail} from "Pages/Teacher/TeacherCourseDetail";
import {TeacherCourseManage} from "Pages/Teacher/TeacherCourseManage";
import {TeacherCourseAddtion} from "Pages/Teacher/TeacherCourseAddtion";
import {TeacherCourseDeletion} from "Pages/Teacher/TeacherCourseDeletion";
import { AdminApplicationTest } from 'Pages/Admin/AdminApplicationTest'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/login" exact component={Login} />
                <Route path="/student" exact component={StudentMain} />
                <Route path="/student/course" exact component={StudentCourse} />
                <Route path="/student/application" exact component={StudentApplication} />
                <Route path="/student/course/:courseid" component={StudentCourseDetail} />
                <Route path="/teacher" exact component={TeacherMain} />
                <Route path="/teacher/coursemanage" exact component={TeacherCourseManage} />
                <Route path="/teacher/coursemanage/addcourse" exact component={TeacherCourseAddtion} />
                <Route path="/teacher/coursemanage/deletecourse" exact component={TeacherCourseDeletion} />
                <Route path="/teacher/coursedetail" exact component={TeacherCourseDetail} />
                <Route path="/admin" exact component={AdminMain} />
                <Route path="/admin/course" exact component={AdminCourse} />
                <Route path="/admin/apptest" exact component={AdminApplicationTest} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
