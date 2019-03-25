import fetch from "isomorphic-fetch";

/**
 * Class PageModel
 */
class PageModel {

    /**
     * Define endpoint
     * @type {string}
     */
    ENDPOINT = 'http://127.0.0.1/wp-json/better-rest-endpoints/v1/page'

    /**
     * Get page data by slug
     * @returns {Promise<*>}
     */
    async getPageDataBySlug(slug = false) {
        let response = {success: false, data: {}}
        if (slug === false || slug === "") return response

        try {
            const url = `http://127.0.0.1:3000/api`
            const data = await (await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    url: `${this.ENDPOINT}/${slug}`
                })
            })).json()

            response.success = true
            response.data = data
        } catch (error) {
            console.log('Error in FrontpageModel.getFrontPageData', error)
        }

        return response
    }
}

/**
 * Export model
 */
export default PageModel;