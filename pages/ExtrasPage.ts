import { BaseFunctions } from "../base/base_functions"
import { Page } from "@playwright/test"


export class ExtrasPage extends BaseFunctions {
    constructor(page: Page) {
        super(page)
    }

    //LOCATORS

    ADD_INSURANCE_BUTTON = this.page.getByRole('button', { name: 'Add insurance' })
    //STANDARD_INSURANCE_RADIO_BUTTON = this.page.locator('#undefined')//1st
    STANDARD_INSURANCE_RADIO_BUTTON = this.page.locator('.pax-table__checkbox-wrapper--enabled')//there are 3 radio buttons
    DONE_BUTTON = this.page.getByRole('button', { name: 'Done' })
    CONTINUE_BUTTON = this.page.getByRole('button', { name: 'Continue' })//x2

    //FUNCTIONS

    click_add_insurance_button = async () => {
        await this.click_element(this.ADD_INSURANCE_BUTTON)
    }

    select_standard_insurance = async (index=0) => {
        await this.click_element(this.STANDARD_INSURANCE_RADIO_BUTTON, index)
    }

    click_done_button = async () => {
        await this.click_element(this.DONE_BUTTON)
    }

    click_continue_button = async () => {
        await this.click_element(this.CONTINUE_BUTTON)
    }
}

  

    //payment
    //iframe data-ref="kyc-iframe"
        


