import Page from "../page.ts";


class NotificationSettingsPage extends Page {

    private readonly btnBackSelector = "eu.livesport.FlashScore_com_plus:id/action_bar_item_5"

    private get btnBack() {
        return this.getElementById(this.btnBackSelector)
    }

    async back() {
        await this.btnBack.click()
    }
}

export default new NotificationSettingsPage();
