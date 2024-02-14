import Page from "../../page.ts";

export class IntroOverlay extends Page{

    private readonly btnContinueSelector = "eu.livesport.FlashScore_com_plus:id/btn_skip"

    async clickContinue() {
        return await this.getElementById(this.btnContinueSelector).click()
    }
}

export default new IntroOverlay()
