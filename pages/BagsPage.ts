import { BaseFunctions } from "../base/base_functions"
import { Page } from "@playwright/test"
import { ExtrasPage } from "./ExtrasPage"


export class BagsPage extends BaseFunctions {

    constructor(page: Page) {
        super(page)
    }

   //LOCATORS
    SMALL_BAG_RADIO_BUTTON = this.page.locator('bags-small-bag-pax-control label')
    CONTINUE_BUTTON = this.page.getByRole('button', { name: 'Continue' })

    //FUNCTIONS

    select_small_bag = async () => {
        await this.click_element(this.SMALL_BAG_RADIO_BUTTON)
    }

    click_continue_button = async () => {
        await this.click_element(this.CONTINUE_BUTTON)
        return new ExtrasPage(this.page)
    }

}

 