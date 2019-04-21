import {Col} from "react-grid-system";

import Layout from "../components/Layout";
import NavigationModel from "../models/NavigationModel";
import PageModel from "../models/PageModel";
import ShortcodeContent from "../components/ShortcodeContent";

const Page = ({menuData, pageData}) => {
    //TODO validate success of requests
    return (
        <Layout metaTitle={pageData.data.title} menuData={menuData}>
            <Col sm={12}>
                <ShortcodeContent content={pageData.data.content}/>
            </Col>
        </Layout>
    )
}

Page.getInitialProps = async ({query}) => {
    return {
        menuData: await new NavigationModel().getMenuByLocationSlug(),
        pageData: await new PageModel().getPageDataBySlug(query.slug)
    }
}


export default Page;