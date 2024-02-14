import {expect} from '@wdio/globals'
import PrivacyPolicy from "../pageobjects/livesport/privacyPolicy.page.ts";
import News from "../pageobjects/livesport/news.page.ts";
import HomePage from "../pageobjects/livesport/home.page.ts";
import SearchPage, {SearchResult} from "../pageobjects/livesport/search.page.ts";
import IntroOverlay from "../pageobjects/livesport/parts/introOverlay.part.ts";
import FavouritesPage from "../pageobjects/livesport/favourites.page.ts";
import FavouritesSettingsPage, {Favourite} from "../pageobjects/livesport/favouritesSettings.page.ts";
import RemoveFromFavouritesDialogPart from "../pageobjects/livesport/parts/removeFromFavouritesDialog.part.ts";

async function verifyToastWithMessage(message: string) {
    // Verify Toast with wanted text is shown and exists
    const selector = `//android.widget.Toast[@text="${message}"]`
    const toast = await $(selector)
    await expect(toast).toBeExisting()
}


describe('Test the Livesport App Favourites behaviour.', () => {
    it('Test team can be added and removed from favourites.', async () => {
        // Serves for results of search and favourite. It is used in multiple 'it' blocks.
        let searchResult: SearchResult
        let favouriteArsenal: Favourite

        // Step 1: 'Start the app and assert default view.'
        // Preparation of the App.
        await PrivacyPolicy.rejectAllCookies()

        // Skip the news, please see inside the method, there is workaround and the button might be missing Id.
        await News.skip()
        // Intro overlay showing after visiting every screen for the first time
        await IntroOverlay.clickContinue()

        // Asserting HomePage is shown with few properties.
        await expect(HomePage.txtSportTitle).toHaveText("Football")
        await HomePage.assertToday()

        // Step 2: 'Click search icon and assert default result is shown.'
        // Initiate search
        await HomePage.search()

        // Assert the search screen contains what it should.
        // TODO: Assert that search is opened with search bar and also "Most Popular Searches" with results !!
        await expect(SearchPage.textViewMostPopularSearches).toHaveText("MOST POPULAR SEARCHES")

        // Step3: 'Search for Arsenal and assert result'

        // Search for Arsenal and assert result team "Arsenal" is present on the first position (index 0), with sport "FOOTBALL".
        await SearchPage.search("Arsenal")

        // The `SearchPage.assertResultOnPosition` method returns the `SearchResult` object, this way we can do operations on it without needing of finding those elements again.
        searchResult = await SearchPage.assertResultOnPosition("Arsenal", "FOOTBALL", 0)

        // Step4: 'Add Arsenal as favourite and verify toast message'
        await searchResult.starElement.click()

        // Verify Toast with wanted text is shown and exists
        await verifyToastWithMessage("Added team to Favorites.")

        // Step5: 'Go back and verify home page is shown with today match'

        // Go back to the HomePage and assert its properties.
        await SearchPage.back()
        await expect(HomePage.txtSportTitle).toHaveText("Football")
        await HomePage.assertToday()

        // Step6: 'Go to favourites'
        // Go to favourites
        await HomePage.bottomNavigationBar.goToFavorites()
        await IntroOverlay.clickContinue()
        await expect(FavouritesPage.titleFavourites).toHaveText("Favorites")

        // Step7: Go To favourites settings and verify favourites teams are shown'
        await FavouritesPage.goToFavouritesSettings()

        // FavouriteSettingsPage
        await expect(FavouritesSettingsPage.titleMyTeams).toHaveText("My Teams")
        await expect(FavouritesSettingsPage.txtSportHeader).toHaveText("Football")

        // Steep8 'Verify that Arsenal is between favourite teams.'

        // Check Arsenal exists between favourites on desired position.
        // The `FavouritesSettingsPage.assertExistenceOfTeam` method returns the `Favourite` object, this way we can do operations on it without needing of finding those elements again.
        favouriteArsenal = await FavouritesSettingsPage.assertExistenceOfTeam(0, "Arsenal")
        // Step9: 'Initiate removing of arsenal from favourite teams.', async () => {
        await favouriteArsenal.removeFromFavourites()

        // Remove Arsenal from the favourites.
        await expect(RemoveFromFavouritesDialogPart.title).toHaveText("Really remove team from Favorites?")

        // Step10: 'Confirm removing Arsenal from favourite teams, verify toast.', async () => {
        await RemoveFromFavouritesDialogPart.remove()
        await verifyToastWithMessage("Removed team from Favorites.")

        // Extra steps to verify favourites are empty
        await expect(FavouritesSettingsPage.emptyTitle).toHaveText("Add your first team")
        await expect(FavouritesSettingsPage.emptySubtitle).toHaveText("Have all matches and important news about your favorite teams in one place.")
        await expect(FavouritesSettingsPage.btnSearchTeam).toHaveText("SEARCH TEAM")
    })
})

