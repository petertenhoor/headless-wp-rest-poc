import {Col} from "react-grid-system";

import Layout from "../components/Layout";
import NavigationModel from "../models/NavigationModel";
import FrontpageModel from "../models/FrontpageModel";

const HomePage = ({menuData, frontpageData}) => {
    //TODO validate success of requests
    return (
        <Layout metaTitle={frontpageData.data.title} menuData={menuData}>
            <Col sm={12}>
                <div dangerouslySetInnerHTML={{__html: frontpageData.data.content}}></div>
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