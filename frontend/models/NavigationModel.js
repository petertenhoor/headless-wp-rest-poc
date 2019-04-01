import fetch from "isomorphic-fetch";

/**
 * Class NavigationModel
 */
class NavigationModel {

    /**
     * Define endpoint
     * @type {string}
     */
    ENDPOINT = 'http://headless-wp-poc.test/wp-json/pth/v1/navigation'

    /**
     * Get menu data by location slug
     * @returns {Promise<*>}
     */
    async getMenuByLocationSlug() {
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
            console.log('Error in NavigationModel.getMenuByLocationSlug', error)
        }

        return response
    }
}

/**
 * Export model
 */
export default NavigationModel;