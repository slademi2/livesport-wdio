import Page from "../page.ts";

class FavouritesPage extends Page {

    private readonly txtFavouritesSelector = "eu.livesport.FlashScore_com_plus:id/action_bar_item_9"
    private readonly imgButtonFavouritesSettingsSelector = "eu.livesport.FlashScore_com_plus:id/action_bar_item_7"

    get titleFavourites() {
        return this.getElementById(this.txtFavouritesSelector)
    }

    async goToFavouritesSettings() {
        await this.getElementById(this.imgButtonFavouritesSettingsSelector).click()
    }
}


export default new FavouritesPage();
