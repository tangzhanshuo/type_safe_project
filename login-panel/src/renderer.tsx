import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { Login } from 'Pages/Login'
import { StudentMain } from 'Pages/StudentMain'
import { TeacherMain } from 'Pages/TeacherMain'
import { AdminMain } from 'Pages/AdminMain'
import { AdminCourse } from 'Pages/AdminCourse'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/login" exact component={Login} />
                <Route path="/student" exact component={StudentMain} />
                <Route path="/teacher" exact component={TeacherMain} />
                <Route path="/admin" exact component={AdminMain} />
                <Route path="/admincourse" exact component={AdminCourse} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
