import Link from 'next/link'
import {Col, Container, Row} from "react-grid-system";
import PropTypes from "prop-types";

import styles from "./index.scss";

const renderMenuItems = (menuData) => {
    return menuData.data.items.map((menuItem) => {
        return (
            <Link prefetch
                  key={menuItem.id}
                  href={menuItem.href}
                  as={menuItem.as}>
                <a className={styles.navigationLink}
                   target={menuItem.target !== null ? menuItem.target : "_self"}>
                    {menuItem.label}
                </a>
            </Link>
        )
    })
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