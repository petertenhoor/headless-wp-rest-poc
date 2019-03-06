import fetch from "isomorphic-fetch";

/**
 * Class NavigationModel
 */
class NavigationModel {

    /**
     * Define endpoint
     * @type {string}
     */
    ENDPOINT = 'http://admin.petertenhoor.nl/wp-json/pth/v1/navigation'

    /**
     * Get menu data by location slug
     * @returns {Promise<*>}
     */
    async getMenuByLocationSlug() {
        let response = {success: false, data: {}}

        try {
            const url = `${this.ENDPOINT}`
            const data = await (await fetch(url)).json()

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