import Page from "../../page.ts";

export class BottomNavigationBar extends Page {
    private readonly allGamesTextSelector = "All Games"
    private readonly liveTextSelector = "LIVE"
    private readonly favoritesTextSelector = "Favorites"
    private readonly newsTextSelector = "News"
    private readonly standingsTextSelector = "Standings"

    async goToAllGames() {
        await this.getElementByText(this.allGamesTextSelector).click();
    }

    async goToLive() {
        await this.getElementByText(this.liveTextSelector).click();

    }

    async goToFavorites() {
        await this.getElementByText(this.favoritesTextSelector).click();

    }

    async goToNews() {
        await this.getElementByText(this.newsTextSelector).click();
    }

    async goToStandings() {
        await this.getElementByText(this.standingsTextSelector).click();
    }
}
