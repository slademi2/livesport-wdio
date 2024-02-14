import Page from "../../page.ts";

class RemoveFromFavouritesDialogPart extends Page {
    private readonly titleSelector = "eu.livesport.FlashScore_com_plus:id/messageTextView"
    private readonly btnNoSelector = "eu.livesport.FlashScore_com_plus:id/negative_button"
    private readonly btnRemoveSelector = "eu.livesport.FlashScore_com_plus:id/positive_button"

    get title() {
        return this.getElementById(this.titleSelector)
    }

    async remove() {
        return await this.getElementById(this.btnRemoveSelector).click()
    }

    async doNotRemove() {
        return await this.getElementById(this.btnNoSelector).click()
    }
}

export default new RemoveFromFavouritesDialogPart()