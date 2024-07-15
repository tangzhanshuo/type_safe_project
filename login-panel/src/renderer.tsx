import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './index.css'
import { Main } from 'Pages/Main'
import { Login } from 'Pages/Login'
import { StudentMain } from 'Pages/Student/StudentMain'
import { StudentCourse } from 'Pages/Student/StudentCourse'
import { StudentApplication } from 'Pages/Student/StudentApplication'
import { StudentCourseDetail } from 'Pages/Student/StudentCourseDetail'
import { TeacherMain } from 'Pages/Teacher/TeacherMain'
import { AdminMain } from 'Pages/Admin/AdminMain'
import { AdminCourse } from 'Pages/Admin/AdminCourse'
import { TeacherCourseDetail } from 'Pages/Teacher/TeacherCourseDetail'
import {TeacherCourse} from "Pages/Teacher/TeacherCourse";
import {TeacherAddCourse} from "Pages/Teacher/TeacherAddCourse";
import { AdminApplication } from 'Pages/Admin/AdminApplication'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/login" exact component={Login} />
                <Route path="/student" exact component={StudentMain} />
                <Route path="/student/course" exact component={StudentCourse} />
                <Route path="/student/application" exact component={StudentApplication} />
                <Route path="/student/course/:courseid(\d+)" component={StudentCourseDetail} />
                <Route path="/teacher" exact component={TeacherMain} />
                <Route path="/teacher/course/:courseid(\d+)" exact component={TeacherCourseDetail} />
                <Route path="/teacher/course/add" exact component={TeacherAddCourse} />
                <Route path="/teacher/course" exact component={TeacherCourse} />
                <Route path="/admin" exact component={AdminMain} />
                <Route path="/admin/course" exact component={AdminCourse} />
                <Route path="/admin/application" exact component={AdminApplication} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
