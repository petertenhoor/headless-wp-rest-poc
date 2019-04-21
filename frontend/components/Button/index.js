import React from "react";
import PropTypes from "prop-types";
import Link from 'next/link'

import styles from "./button.scss";

const Button = ({text, type, target, link}) => {
    return (
        <Link href={link} as={link}>
            <a className={styles.button}
               data-type={type}
               target={target}>
                {text}
            </a>
        </Link>
    )
}

Button.defaultProps = {
    text: "",
    type: 'black',
    target: '_self',
    link: '#'
}

Button.propTypes = {
    text: PropTypes.string,
    type: PropTypes.string,
    target: PropTypes.string,
    link: PropTypes.string
}

export default Button;