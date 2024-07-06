import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { StudentMain } from 'Pages/StudentMain'
import { Admin } from 'Pages/Admin'
import { AdminCourse } from 'Pages/AdminCourse'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/studentmain" exact component={StudentMain} />
                <Route path="/admin" exact component={Admin} />
                <Route path="/admincourse" exact component={AdminCourse} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
