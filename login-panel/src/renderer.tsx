import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { Login } from 'Pages/Login'
import { StudentMain } from 'Pages/Student/StudentMain'
import { StudentCourse } from 'Pages/Student/StudentCourse'
import { StudentCourseDetail } from 'Pages/Student/StudentCourseDetail'
import { TeacherMain } from 'Pages/Teacher/TeacherMain'
import { AdminMain } from 'Pages/AdminMain'
import { AdminCourse } from 'Pages/AdminCourse'
import {TeacherCourseDetail} from "Pages/Teacher/TeacherCourseDetail";
import {TeacherCourseManage} from "Pages/Teacher/TeacherCourseManage";

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/login" exact component={Login} />
                <Route path="/student" exact component={StudentMain} />
                <Route path="/student/course" exact component={StudentCourse} />
                <Route path="/student/course/:courseid" component={StudentCourseDetail} />
                <Route path="/teacher" exact component={TeacherMain} />
                <Route path="/teacher/coursemanage" exact component={TeacherCourseManage} />
                <Route path="/teacher/coursedetail" exact component={TeacherCourseDetail} />
                <Route path="/admin" exact component={AdminMain} />
                <Route path="/admin/course" exact component={AdminCourse} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
