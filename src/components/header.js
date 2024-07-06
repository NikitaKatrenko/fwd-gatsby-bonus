import * as React from "react"
import { Link } from "gatsby"

const HeaderSlice = ({ isRootPath, title }) => {
    let header

    if (isRootPath) {
        header = (
            <h1 className="main-heading">
                <Link to="/">{title}</Link>
            </h1>
        )
    } else {
        header = (
            <Link className="header-link-home" to="/">
                {title}
            </Link>
        )
    }

    return <header className="global-header">{header}</header>
}

export default HeaderSlice