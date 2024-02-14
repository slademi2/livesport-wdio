import {expect} from '@wdio/globals'
import PrivacyPolicy from "../pageobjects/livesport/privacyPolicy.page.ts";
import News from "../pageobjects/livesport/news.page.ts";
import HomePage from "../pageobjects/livesport/home.page.ts";
import SearchPage from "../pageobjects/livesport/search.page.ts";
import IntroOverlay from "../pageobjects/livesport/parts/introOverlay.part.ts";
import FavouritesPage from "../pageobjects/livesport/favourites.page.ts";
import FavouritesSettingsPage from "../pageobjects/livesport/favouritesSettings.page.ts";
import RemoveFromFavouritesDialogPart from "../pageobjects/livesport/parts/removeFromFavouritesDialog.part.ts";

async function verifyToastWithMessage(message: string) {
    // Verify Toast with wanted text is shown and exists
    const selector = `//android.widget.Toast[@text="${message}"]`
    const toast = await $(selector)
    await expect(toast).toBeExisting()
}


describe('Test the Livesport App Favourites behaviour.', () => {
    it('Test team can be added and removed from favourites.', async () => {

        const favouriteTeam = "Arsenal"
        // Step 1: 'Start the app and assert default view.'
        // Preparation of the App. Wait for PrivacyPolicy screen to show and close it by rejecting all cookies.
        await PrivacyPolicy.rejectAllCookies()

        // Skip the news screen, please see inside the method, there is workaround and the button might be missing ID.
        await News.skip()
        // Intro overlay showing after visiting every screen for the first time, let's continue.
        await IntroOverlay.clickContinue()

        // Asserting HomePage is shown with few properties.
        // For reason of not asserting every single propery on the homepage, I chose to assert the chosen sport and Today's date.
        await expect(HomePage.txtSportTitle).toHaveText("Football")
        await HomePage.assertToday()

        // Step 2: 'Click search icon and assert default result is shown.'
        // Initiate search
        await HomePage.search()

        // Assert the search screen contains Most popular searches title and search bar. Skipping asserts of results as we don't know what should be there.
        await expect(SearchPage.textViewMostPopularSearches).toHaveText("MOST POPULAR SEARCHES")
        await expect(SearchPage.editTextSearch).toExist()
        await expect(SearchPage.btnBack).toExist()

        // Step3: 'Search for Arsenal and assert result'
        // Search for Arsenal and assert result team "Arsenal" is present on the first position (index 0), with sport "FOOTBALL".
        await SearchPage.search(favouriteTeam)

        // The `SearchPage.assertResultOnPosition` method returns the `SearchResult` object, this way we can do operations on it without needing of finding those elements again.
        const searchResult = await SearchPage.assertResultOnPosition(favouriteTeam, "FOOTBALL", 0)

        // Step4: 'Add Arsenal as favourite and verify toast message'
        await searchResult.starElement.click()

        // Verify Toast with wanted text is shown and exists
        await verifyToastWithMessage("Added team to Favorites.")

        // Step5: 'Go back and verify home page is shown with today match'
        // Go back to the HomePage and assert its properties.
        await SearchPage.back()
        // Again asserting home page.
        await expect(HomePage.txtSportTitle).toHaveText("Football")
        await HomePage.assertToday()

        // Step6: 'Go to favourites'
        // Go to favourites
        // We could assert here that bottomNavigationBar contains all the elements it should, but it is not scope of this test.
        await HomePage.bottomNavigationBar.goToFavorites()

        // Skipping Intro overlay.
        await IntroOverlay.clickContinue()
        // We can't assert much as we don't know what matches are ahead for Arsenal.
        // We could assert other elements like "Games / News"  and "All Games / Live" switchers, but I assumed it is not scope of this test.
        await expect(FavouritesPage.titleFavourites).toHaveText("Favorites")
        await expect(FavouritesPage.imgButtonFavouritesSettings).toExist()

        // Step7: Go To favourites settings and verify favourites teams are shown
        await FavouritesPage.goToFavouritesSettings()

        // FavouriteSettingsPage
        // Asserting that "My Teams" title is shown and "Football" section is shown
        await expect(FavouritesSettingsPage.titleMyTeams).toHaveText("My Teams")
        await expect(FavouritesSettingsPage.txtSportHeader).toHaveText("Football")

        // Steep8 'Verify that Arsenal is between favourite teams.'
        // Check Arsenal exists between favourites on desired position.
        // The `FavouritesSettingsPage.assertExistenceOfTeam` method returns the `Favourite` object, this way we can do operations on it without needing of finding those elements again.
        const favouriteArsenal = await FavouritesSettingsPage.assertExistenceOfTeam(0, favouriteTeam)

        // Step9: 'Initiate removing of arsenal from favourite teams.
        await favouriteArsenal.removeFromFavourites()
        // Assert that remove dialog has necessary strings.
        await expect(RemoveFromFavouritesDialogPart.title).toHaveText("Really remove team from Favorites?")
        await expect(RemoveFromFavouritesDialogPart.btnRemove).toHaveText("REMOVE!")
        await expect(RemoveFromFavouritesDialogPart.btnNo).toHaveText("NO")

        // Step10: 'Confirm removing Arsenal from favourite teams, verify toast.', async () => {
        await RemoveFromFavouritesDialogPart.remove()
        await verifyToastWithMessage("Removed team from Favorites.")

        // Extra steps to verify favourites are empty.
        await expect(FavouritesSettingsPage.emptyTitle).toHaveText("Add your first team")
        await expect(FavouritesSettingsPage.emptySubtitle).toHaveText("Have all matches and important news about your favorite teams in one place.")
        await expect(FavouritesSettingsPage.btnSearchTeam).toHaveText("SEARCH TEAM")
    })
})
