import fetch from "isomorphic-fetch";

/**
 * Class PageModel
 */
class PostModel {

    /**
     * Define endpoints
     * @type {string}
     */
    ENDPOINT_POSTS = 'http://headless-wp-poc.test/wp-json/better-rest-endpoints/v1/posts'
    ENDPOINT_POST = 'http://headless-wp-poc.test/wp-json/better-rest-endpoints/v1/post'

    /**
     * Get all posts
     * @returns {Promise<*>}
     */
    async getAll() {
        let response = {success: false, data: {}}

        try {
            const url = `http://127.0.0.1:3000/api`
            const data = await (await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    url: this.ENDPOINT_POSTS
                })
            })).json()

            response.success = true
            response.data = data
        } catch (error) {
            console.log('Error in PostModel.getAll', error)
        }

        return response
    }

    /**
     * Get post data by slug
     * @param slug
     * @returns {Promise<{success: boolean, data: {}}>}
     */
    async getPostDataBySlug(slug = false) {
        let response = {success: false, data: {}}
        if (slug === false || slug === '') return response

        try {
            const url = `http://127.0.0.1:3000/api`
            const data = await (await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    url: `${this.ENDPOINT_POST}/${slug}`
                })
            })).json()

            response.success = true
            response.data = data
        } catch (error) {
            console.log('Error in PostModel.getPostBySlug', error)
        }

        return response
    }
}

/**
 * Export model
 */
export default PostModel;