import fetch from "isomorphic-fetch";

/**
 * Class FrontpageModel
 */
class FrontpageModel {

    /**
     * Define endpoint
     * @type {string}
     */
    ENDPOINT = 'http://admin.petertenhoor.nl/wp-json/pth/v1/frontpage'

    /**
     * Get frontpage data
     * @returns {Promise<*>}
     */
    async getFrontPageData() {
        let response = {success: false, data: {}}

        try {
            const url = `${this.ENDPOINT}`
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
export default FrontpageModel;