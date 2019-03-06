import {Col} from "react-grid-system";

import Layout from "../components/Layout";
import PostSnippet from "../components/PostSnippet";
import NavigationModel from "../models/NavigationModel";
import PostModel from "../models/PostModel";

const PostsPage = ({menuData, postData}) => {
    return (
        <Layout metaTitle={`Posts archive`} menuData={menuData}>
            <React.Fragment>
                {postData.data.map((postData) => {
                        return (
                            <Col sm={4} key={postData.id}>
                                <PostSnippet post={postData}/>
                            </Col>
                        )
                    }
                )}
            </React.Fragment>
        </Layout>
    )
}

/**
 * Get initial props
 */
PostsPage.getInitialProps = async ({req}) => {
    return {
        menuData: await new NavigationModel().getMenuByLocationSlug(),
        postData: await new PostModel().getAll()
    }
}

/**
 * Export component
 */
export default PostsPage;