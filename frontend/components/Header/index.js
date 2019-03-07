import Link from 'next/link'
import {Col, Container, Row} from "react-grid-system";
import PropTypes from "prop-types";

import styles from "./index.scss";

/**
 * Render menu items
 *
 * @param menuData
 * @returns {*}
 */
const renderMenuItems = (menuData) => {
    return menuData.data.items.map(item => {

        //handle custom menu items
        if (item.object === 'custom') {
            return (
                <Link href={item.url} key={item.ID}>
                    <a className={styles.navigationLink}
                       target={item.target !== null ? item.target : "_self"}>
                        {item.title}
                    </a>
                </Link>
            )
        }

        //handle home route
        if (item.isHome === true) {
            return (
                <Link href={'/'} key={item.ID}>
                    <a className={styles.navigationLink}
                       target={item.target !== null ? item.target : "_self"}>
                        {item.title}
                    </a>
                </Link>
            )
        }

        //handle pages
        if (item.object === "page") {
            return (
                <Link href={`/${item.object}?slug=${item.slug}`} as={`/${item.slug}`} key={item.ID}>
                    <a className={styles.navigationLink}
                       target={item.target !== null ? item.target : "_self"}>
                        {item.title}
                    </a>
                </Link>
            )
        }

        //handle blog
        if (item.object === "post") {
            return (
                <Link href={`/single-blog?slug=${item.slug}`} as={`/blog/${item.slug}`} key={item.ID}>
                    <a className={styles.navigationLink}
                       target={item.target !== null ? item.target : "_self"}>
                        {item.title}
                    </a>
                </Link>
            )
        }

        //handle other dynamic routes
        return (
            <Link href={`/${item.object}?slug=${item.slug}`} as={`/${item.object}/${item.slug}`} key={item.ID}>
                <a className={styles.navigationLink}
                   target={item.target !== null ? item.target : "_self"}>
                    {item.title}
                </a>
            </Link>
        )
    });
}

const Header = ({menuData}) => {
    return (
        <Container component={'header'} fluid className={styles.header}>
            <Container style={{width: "100%", padding: "0"}}>
                <Row style={{width: "100%"}} align="center">
                    <Col sm={3}>
                        <Link prefetch href="/" as="/">
                            <a>
                                <h2 className={styles.logo}>
                                    PTH
                                </h2>
                            </a>
                        </Link>
                    </Col>
                    <Col sm={9} component="nav" className={styles.navigation}>
                        {renderMenuItems(menuData)}
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

Header.propTypes = {
    menuData: PropTypes.object
}

export default Header;