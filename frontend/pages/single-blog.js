import Link from 'next/link'
import moment from "moment";
import {Col} from "react-grid-system";

import Layout from "../components/Layout";
import styles from "../scss/page/post.scss";
import NavigationModel from "../models/NavigationModel";
import PostModel from "../models/PostModel";
import ShortcodeContent from "../components/ShortcodeContent";

const SingleBlog = ({menuData, postData}) => {
    return (
        <Layout metaTitle={`${postData.data.title} | Blog`} menuData={menuData}>

            {postData.data.media.large ? (
                <Col sm={6} component="figure">
                    <img src={postData.data.media.large}
                         className={styles.featuredImage}
                         alt={postData.data.title}/>
                </Col>
            ) : null}


            <Col sm={postData.data.media.imageSizePost ? 6 : 12}>

                <h1 className={styles.postTitle}>
                    {postData.data.title}
                </h1>

                <span className={styles.postDate}>
                                {moment(postData.data.date).format("MMM Do YYYY")}
                            </span>

                <ShortcodeContent content={postData.data.content}/>

                <Link href={'/blog'} as={'/blog'}>
                    <a className={styles.archiveLink}>Back to archive</a>
                </Link>

            </Col>

        </Layout>
    )
}

SingleBlog.getInitialProps = async ({query}) => {
    return {
        menuData: await new NavigationModel().getMenuByLocationSlug(),
        postData: await new PostModel().getPostDataBySlug(query.slug)
    }
}


export default SingleBlog;