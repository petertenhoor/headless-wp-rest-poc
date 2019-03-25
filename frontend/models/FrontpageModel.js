import fetch from "isomorphic-fetch";

/**
 * Class FrontpageModel
 */
class FrontpageModel {

    /**
     * Define endpoint
     * @type {string}
     */
    ENDPOINT = 'http://127.0.0.1/wp-json/pth/v1/frontpage'

    /**
     * Get frontpage data
     * @returns {Promise<*>}
     */
    async getFrontPageData() {
        let response = {success: false, data: {}}

        try {
            const url = `http://127.0.0.1:3000/api`
            const data = await (await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    url: `${this.ENDPOINT}`
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
export default FrontpageModel;