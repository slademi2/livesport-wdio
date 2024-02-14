import Page from "../page.ts";

class FavouritesPage extends Page {

    private readonly txtFavouritesSelector = "eu.livesport.FlashScore_com_plus:id/action_bar_item_9"
    private readonly imgButtonFavouritesSettingsSelector = "eu.livesport.FlashScore_com_plus:id/action_bar_item_7"

    get titleFavourites() {
        return this.getElementById(this.txtFavouritesSelector)
    }

    get imgButtonFavouritesSettings() {
        return this.getElementById(this.imgButtonFavouritesSettingsSelector)
    }

    async goToFavouritesSettings() {
        await this.imgButtonFavouritesSettings.click()
    }
}


export default new FavouritesPage();
