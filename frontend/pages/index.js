import {Col} from "react-grid-system";

import Layout from "../components/Layout";
import NavigationModel from "../models/NavigationModel";
import FrontpageModel from "../models/FrontpageModel";
import ShortcodeContent from "../components/ShortcodeContent";

const HomePage = ({menuData, frontpageData}) => {
    //TODO validate success of requests
    return (
        <Layout metaTitle={frontpageData.data.title} menuData={menuData}>
            <Col sm={12}>
                <ShortcodeContent content={frontpageData.data.content}/>
            </Col>
        </Layout>
    )
}

/**
 * Get initial props
 */
HomePage.getInitialProps = async ({req}) => {
    return {
        menuData: await new NavigationModel().getMenuByLocationSlug(),
        frontpageData: await new FrontpageModel().getFrontPageData()
    }
}

/**
 * Export component
 */
export default HomePage;