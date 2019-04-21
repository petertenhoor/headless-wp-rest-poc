import React from "react";
import PropTypes from "prop-types";
import JsxParser from 'react-jsx-parser';

import Button from "../../components/Button";

class ShortcodeContent extends React.PureComponent {

    /**
     * Render lifecycle
     * @returns {*}
     */
    render() {
        const {content} = this.props
        return (
            <JsxParser components={{Button}} jsx={content}/>
        )
    }
}

ShortcodeContent.propTypes = {
    content: ""
}

ShortcodeContent.propTypes = {
    content: PropTypes.string
}

export default ShortcodeContent;