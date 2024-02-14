import Page from '../page.js';

/**
 * Page representing PrivacyPolicy.
 */
class PrivacyPolicyPage extends Page {

    private readonly btnRejectAllSelector = 'eu.livesport.FlashScore_com_plus:id/btn_reject_cookies';
    private readonly btnAcceptAllSelector = 'eu.livesport.FlashScore_com_plus:id/btn_accept_cookies';
    private readonly btnShowPurposesSelector = 'eu.livesport.FlashScore_com_plus:id/cookies_setting_button';

    public get btnRejectAll() {
        return this.getElementById(this.btnRejectAllSelector);
    }

    public get btnAcceptAll() {
        return this.getElementById(this.btnAcceptAllSelector);
    }

    public get btnShowPurposes() {
        return this.getElementById(this.btnShowPurposesSelector);
    }

    public async rejectAllCookies() {
        await this.btnRejectAll.click();
    }

    public async acceptAllCookies() {
        await this.btnAcceptAll.click();
    }
}

export default new PrivacyPolicyPage();
