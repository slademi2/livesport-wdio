import Page from "../page.ts";
import {expect} from "@wdio/globals";
import {BottomNavigationBar} from "./parts/bottomNavigationBar.part.ts";

export class Favourite {
    name: WebdriverIO.Element
    checkbox: WebdriverIO.Element

    constructor(name: WebdriverIO.Element, checkbox: WebdriverIO.Element) {
        this.name = name
        this.checkbox = checkbox
    }

    async removeFromFavourites() {
        await this.checkbox.click()
    }
}

class FavouritesSettingsPage extends Page {

    // When some team is present
    private readonly btnBackSelector = "eu.livesport.FlashScore_com_plus:id/action_bar_item_5"
    private readonly txtMyTeamsSelector = "eu.livesport.FlashScore_com_plus:id/action_bar_item_10"
    private readonly txtSportHeaderSelector = "eu.livesport.FlashScore_com_plus:id/sportHeader"

    // When favourites are empty
    private readonly titleEmptyFavouritesSelector = "eu.livesport.FlashScore_com_plus:id/title"
    private readonly subtitleEmptyFavouritesSelector = "eu.livesport.FlashScore_com_plus:id/subtitle"
    private readonly btnSearchTeamSelector = "eu.livesport.FlashScore_com_plus:id/findButton"

    bottomNavigationBar: BottomNavigationBar = new BottomNavigationBar()

    get titleMyTeams() {
        return this.getElementById(this.txtMyTeamsSelector)
    }

    get txtSportHeader() {
        return this.getElementById(this.txtSportHeaderSelector)
    }

    async back() {
        await this.getElementById(this.btnBackSelector).click()
    }

    /**
     * Asserts that team with `name` is present in favourites list on desired index
     * @param index - index where team should be present
     * @param name - name of the team
     * @return Favourite - Returns favourite team, so other operations can be performed on it
     */
    //TODO: This is now limited only to one sport (which is also represented by ViewGroup), it would be great to extend it to multiple sports if needed.
    async assertExistenceOfTeam(index: number, name: string) {
        const favouritesContent = await this.getElementByResourceId("eu.livesport.FlashScore_com_plus:id/myFsFavoritesRecyclerView")
        let team = null
        let starCheckbox = null
        try {
            // Using index + 1 because first viewGroup is taken by sport's name.
            const result = favouritesContent.$$("//android.view.ViewGroup")[index + 1]
            team = await result.$(
                "id:eu.livesport.FlashScore_com_plus:id/participant_name"
            )
            starCheckbox = await result.$(
                "//android.view.View/android.widget.CheckBox"
            )
        } catch (e) {
            throw Error(`Index ${index} is out of bounds.`)
        }
        await expect(team).toHaveText(name)
        return new Favourite(team, starCheckbox)
    }

    get emptyTitle() {
        return this.getElementById(this.titleEmptyFavouritesSelector)
    }

    get emptySubtitle() {
        return this.getElementById(this.subtitleEmptyFavouritesSelector)
    }

    get btnSearchTeam() {
        return this.getElementById(this.btnSearchTeamSelector)
    }
}


export default new FavouritesSettingsPage();
