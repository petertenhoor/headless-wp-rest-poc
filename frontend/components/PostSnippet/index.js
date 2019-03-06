import Link from 'next/link'
import moment from "moment";

import styles from "./index.scss";

const PostSnippet = ({post}) => {
    return (
        <Link prefetch href={`/post?slug=${post.slug}`} as={`/post/${post.slug}`}>

            <a className={styles.postSnippet}>

                {post.media.imageSizePost ? (
                    <figure className={styles.postSnippetImageContainer}>
                        <img src={post.media.imageSizePost}
                             className={styles.postSnippetImage}
                             alt={post.title}/>
                    </figure>
                ) : null}

                <div className={styles.postSnippetMeta}>

                    <h3 className={styles.snippetPostTitle}>
                        {post.title}
                    </h3>

                    <span className={styles.snippetPostDate}>
                        {moment(post.date).format("MMM Do YYYY")}
                     </span>

                    <p className={styles.snippetPostContent}
                         dangerouslySetInnerHTML={{__html: post.excerpt}}>
                    </p>

                </div>

            </a>

        </Link>
    )
}

export default PostSnippet;