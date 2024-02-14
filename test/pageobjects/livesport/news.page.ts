import Page from "../page.ts";

class NewsPage extends Page {

    private readonly btnChangeSettingsSelector = "eu.livesport.FlashScore_com_plus:id/btn_set_settings"
    private readonly btnSkipSelector = 'android=new UiSelector().resourceId("eu.livesport.FlashScore_com_plus:id/btn_skip").text("Skip")'

    private get btnChangeSettings() {
        return this.getElementById(this.btnChangeSettingsSelector)
    }

    private get btnSkip() {
        // For some reason when using Id, the click on element doesn't work. The Appium viewer seems no to find the btn_skip id as well.
        // return this.getElementById("eu.livesport.FlashScore_com_plus:id/btn_skip")
        // Therefore, using workaround with resourceId and text.
        return $(this.btnSkipSelector)
    }

    public async goToSettings() {
        await this.btnChangeSettings.click()
    }

    public async skip() {
        await this.btnSkip.click()
    }
}


export default new NewsPage();
