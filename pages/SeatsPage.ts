import { BaseFunctions } from "../base/base_functions"
import {Page} from "@playwright/test"
import { BagsPage } from "./BagsPage"

export class SeatsPage extends BaseFunctions {

    constructor(page: Page){
        super(page)
    }

    //LOCATORS
    STANDARD_SEAT_ARRAY = this.page.locator('.seatmap__seat--standard')
    NEXT_FLIGHT_BUTTON = this.page.getByRole('button', { name: 'Next flight' })
    SELECT_SAME_SEAT_NO_BUTTON = this.page.getByRole('button', { name: 'No, thanks' }) //same seat
    SELECT_SAME_SEAT_YES_BUTTON = this.page.getByRole('button', { name: 'Pick these seats' })
    CONTINUE_BUTTON = this.page.getByRole('button', { name: 'Continue' })
    //DECLINE_FAST_TRACK_BUTTON = this.page.getByRole('button', { name: 'No, thanks' }) //fast track pop-up iframe
    DECLINE_FAST_TRACK_BUTTON = this.page.locator('button.enhanced-takeover-beta__product-dismiss-cta')
    ACCEPT_FAST_TRACK_BUTTON = this.page.getByRole('button', { name: 'Add Fast Track' }) 

    //FUNCTIONS
select_random_seat = async () => {
    try {
        //await this.page.waitForTimeout(1000)
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.waitForLoadState('networkidle')
        await this.page.waitForTimeout(1000)
        const index = Math.floor(Math.random() * await this.STANDARD_SEAT_ARRAY.count())
        await this.click_element(this.STANDARD_SEAT_ARRAY, index)

        if (await this.SELECT_SAME_SEAT_NO_BUTTON.isVisible()) {
            await this.click_element(this.SELECT_SAME_SEAT_NO_BUTTON)
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error selecting random seat: ${error.message}`)
        } else {
            throw new Error("Couldn't select random seat")
        }
    }
}


click_next_flight = async () => {
    await this.click_element(this.NEXT_FLIGHT_BUTTON)
}

decline_same_seat_selection = async () => {
    await this.click_element(this.SELECT_SAME_SEAT_NO_BUTTON)
}

click_continue_button = async () => {
    await this.click_element(this.CONTINUE_BUTTON)
}

decline_fast_track = async () => {
    await this.click_element(this.DECLINE_FAST_TRACK_BUTTON)
    return new BagsPage(this.page)
}

}



