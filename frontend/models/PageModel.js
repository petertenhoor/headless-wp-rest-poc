import fetch from "isomorphic-fetch";

/**
 * Class PageModel
 */
class PageModel {

    /**
     * Define endpoint
     * @type {string}
     */
    ENDPOINT = 'http://admin.petertenhoor.nl/wp-json/better-rest-endpoints/v1/page'

    /**
     * Get page data by slug
     * @returns {Promise<*>}
     */
    async getPageDataBySlug(slug = false) {
        let response = {success: false, data: {}}
        if (slug === false || slug === "") return response

        try {
            const url = `${this.ENDPOINT}/${slug}`
            const data = await (await fetch(url)).json()

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