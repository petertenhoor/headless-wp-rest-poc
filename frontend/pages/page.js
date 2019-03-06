import {Col} from "react-grid-system";
import Layout from "../components/Layout";
import NavigationModel from "../models/NavigationModel";
import PageModel from "../models/PageModel";

const Page = ({menuData, pageData}) => {
    //TODO validate success of requests
    return (
        <Layout metaTitle={pageData.data.title} menuData={menuData}>
            <Col sm={12}>
                <h1>{pageData.data.title}</h1>
                <div dangerouslySetInnerHTML={{__html: pageData.data.content}}></div>
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