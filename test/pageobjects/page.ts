/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
    public getElementById(id: string) {
        const selector = `id:${id}`;
        return $(selector);
    }

    public getElementsById(id: string) {
        const selector = `id:${id}`;
        return $$(selector);
    }

    public getElementByResourceId(id: string) {
        const selector = `android=new UiSelector().resourceId("${id}")`
        return $(selector)
    }

    public getElementByText(text: string){
        const selector = `android=new UiSelector().text("${text}")`
        return $(selector)
    }
}
