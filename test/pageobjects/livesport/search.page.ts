import Page from "../page.ts";
import * as assert from "assert";


export class SearchResult {
    teamElement: WebdriverIO.Element
    sportElement: WebdriverIO.Element
    starElement: WebdriverIO.Element

    constructor(teamElement: WebdriverIO.Element, sportElement: WebdriverIO.Element, starElement: WebdriverIO.Element) {
        this.teamElement = teamElement
        this.sportElement = sportElement
        this.starElement = starElement
    }
}

class SearchPage extends Page {

    private readonly editTextSearchSelector = "eu.livesport.FlashScore_com_plus:id/search_input";
    private readonly btnBackSelector = "eu.livesport.FlashScore_com_plus:id/back_button";
    private readonly textViewMostPopularSearchesSelector = "eu.livesport.FlashScore_com_plus:id/header";

    private get editTextSearch() {
        return this.getElementById(this.editTextSearchSelector);
    }

    private get btnBack() {
        return this.getElementById(this.btnBackSelector);
    }

    public get textViewMostPopularSearches() {
        return this.getElementById(this.textViewMostPopularSearchesSelector);
    }

    public async search(text: string) {
        await this.editTextSearch.setValue(text)
    }

    /**
     * Searches the `text` and asserts found result using search text field.
     * Returns the SearchResult containing elements on specified index for further use.
     * If the `index` is out of bounds the test will fail.
     * @param text - Exact text to be found and asserted.
     * @param sportText - Text of sport expected.
     * @param index - Optional argument, specifies on which index the text should be found.
     * @return SearchResult .
     */
    public async assertResultOnPosition(text: string, sportText: string, index: number): Promise<SearchResult> {
        const searchResults = await this.getElementById("eu.livesport.FlashScore_com_plus:id/content")
        let team = null
        let sport = null
        let starCheckbox = null
        try {
            const result = searchResults.$$("//android.view.ViewGroup")[index]
            team = await result.$(
                "id:eu.livesport.FlashScore_com_plus:id/participant_name"
            )

            sport = await result.$(
                "id:eu.livesport.FlashScore_com_plus:id/country_name"
            )

            starCheckbox = await result.$(
                "//android.view.View/android.widget.CheckBox"
            )
        } catch (e) {
            throw Error(`Index ${index} is out of bounds.`)
        }

        // TODO: Comparing to the equality with text. We might need to use contain if we'd like to search for partial string.
        assert.strictEqual(await team?.getText(), text, `The ${index}. result is not '${text}'`)
        assert.strictEqual(await sport?.getText(), sportText, `The ${index}. result's sport is not '${sport}'`)

        return new SearchResult(team, sport, starCheckbox)
    }

    public async back() {
        await this.btnBack.click()
    }
}

export default new SearchPage();