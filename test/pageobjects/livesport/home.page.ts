import Page from "../page.ts";
import {expect} from '@wdio/globals';
import {BottomNavigationBar} from "./parts/bottomNavigationBar.part.ts";

class HomePage extends Page {
    shownSport: string
    bottomNavigationBar: BottomNavigationBar

    private readonly calendarTabsSelector = "eu.livesport.FlashScore_com_plus:id/calendarTabs";
    private readonly txtTodaySelector = "id:eu.livesport.FlashScore_com_plus:id/dayText";
    private readonly txtDateSelector = "id:eu.livesport.FlashScore_com_plus:id/dateText";
    private readonly txtSportTitleSelector = "eu.livesport.FlashScore_com_plus:id/title"
    private readonly btnSkipSelector = "eu.livesport.FlashScore_com_plus:id/btn_skip"
    private readonly imgBtnSelector = "eu.livesport.FlashScore_com_plus:id/action_bar_item_3"

    constructor(shownSport: string) {
        super();
        this.shownSport = shownSport
        this.bottomNavigationBar = new BottomNavigationBar()
    }

    public get txtToday() {
        const calendarTabs = this.getElementById(this.calendarTabsSelector)
        // TODO: Change to dynamic counting later.
        // Today should be in the middle every time, there seems to be 14 elements of days. Hardcoded for now
        const today = calendarTabs.$$("android.widget.LinearLayout")[7]
        return today.$(this.txtTodaySelector)
    }


    public get txtDate() {
        const calendarTabs = this.getElementById(this.calendarTabsSelector)

        // Today should be in the middle every time, I suppose the [7] might change in the future, might be better to count it dinamically.
        const today = calendarTabs.$$("android.widget.LinearLayout")[7]
        return today.$(this.txtDateSelector)
    }


    public get txtSportTitle() {
        return this.getElementById(this.txtSportTitleSelector)
    }

    private get btnSkip() {
        return this.getElementById(this.btnSkipSelector)
    }

    private get imgBtnSearch() {
        return this.getElementById(this.imgBtnSelector)
    }

    public async continue() {
        await this.btnSkip.click()
    }

    public async search() {
        await this.imgBtnSearch.click()
    }

    /**
     * Asserts that TODAY string with today's date is displayed at top bar in the middle.
     */
    //TODO: It would be good to make it dynamic later for asserting other days as well.
    public async assertToday() {
        const today = this.txtToday
        const date = this.txtDate

        const currentDate = new Date();

        const day = ('0' + currentDate.getDate()).slice(-2);
        const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        await expect(today).toHaveText("TODAY")
        await expect(date).toHaveText(`${day}.${month}.`)
    }
}

// default as Football as it is default setup for the fresh install
export default new HomePage("Football");