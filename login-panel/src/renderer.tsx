import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { StudentMain } from 'Pages/StudentMain'
import { Admin } from 'Pages/Admin'
import { AdminJoke } from 'Pages/AdminJoke'
import { StudentJoke } from 'Pages/StudentJoke'
import { TeacherJoke } from 'Pages/TeacherJoke'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/studentmain" exact component={StudentMain} />
                <Route path="/admin" exact component={Admin} />
                <Route path="/adminjoke" exact component={AdminJoke} />
                <Route path="/studentjoke" exact component={StudentJoke} />
                <Route path="/teacherjoke" exact component={TeacherJoke} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
