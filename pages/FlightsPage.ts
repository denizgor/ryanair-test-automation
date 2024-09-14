import { BaseFunctions } from "../base/base_functions"
import { Page } from "@playwright/test"
import {SeatsPage} from "./SeatsPage"


export class FlightsPage extends BaseFunctions {
    constructor(page: Page) {
        super(page)
    }

    //LOCATORS
    NEXT_DAY_SLIDER = this.page.locator('.slick-slide.slick-active')
    NEXT_DAY_ARROW = this.page.locator('[aria-label="Search next dates"]')
    PREVIOUS_DAY_ARROW = this.page.locator('[aria-label="Search previous dates"]')
    DEPARTURE_FLIGHT_LIST = this.page.locator('[data-e2e="flight-card--outbound"]')
    RETURN_FLIGHT_LIST = this.page.locator('[data-e2e="flight-card--inbound"]')
    
    PACKAGE_BASIC = this.page.locator('[data-e2e="fare-card-standard"]')
    PACKAGE_REGULAR = this.page.locator('[data-e2e="fare-card-regular"]')
    PACKAGE_PLUS = this.page.locator('[data-e2e="fare-card-plus"]')
    PACKAGE_FLEXI = this.page.locator('[data-e2e="fare-card-flexi"]')
    FARE_PACKAGES = [this.PACKAGE_BASIC, this.PACKAGE_REGULAR, this.PACKAGE_PLUS, this.PACKAGE_FLEXI]

    CONTINIUE_WITH_BASIC_PACKAGE = this.page.getByRole('button', { name: 'Continue with Basic' })
    LOGIN_LATER_BUTTON = this.page.getByRole('button', { name: 'Log in later' })
    TITLE_SELECT_DROPDOWN = this.page.getByRole('button', { name: '-' })
    TITLE_MR = this.page.getByRole('button', { name: 'Mr' })
    TITLE_MRS = this.page.getByRole('button', { name: 'Mrs' })
    TITLE_MISS = this.page.getByRole('button', { name: 'Ms' })
    NAME_INPUT = this.page.getByLabel('First name')
    SURNAME_INPUT = this.page.getByLabel('Last name')
    CONTINUE_BUTTON = this.page.getByRole('button', { name: 'Continue' })
    DEPARTURE_AND_RETURN_AIRPORT = this.page.locator('h4.title-s-lg')
    SINGLE_TICKET_PRICE = this.page.locator('[data-e2e="flight-card-price"]')
    PASSENGER_DETAILS = this.page.locator('.ngrx-forms-unsubmitted')
    FLIGHT_DETAILS_SUMMARY = this.page.locator('.details__bottom-bar ')

    departure_flight_index = this.generateRandomIndex(this.DEPARTURE_FLIGHT_LIST)
    arrival_flight_index = this.generateRandomIndex(this.RETURN_FLIGHT_LIST)

    


    //FUNCTIONS
    select_departure_flight = async () => {
        //const index = Math.floor(Math.random() * await this.DEPARTURE_FLIGHT_LIST.count())
        console.log("DP Index on FP: ", await this.departure_flight_index)
        await this.click_element(this.DEPARTURE_FLIGHT_LIST,  await this.departure_flight_index)
    }

    select_return_flight = async () => {
        //const index = Math.floor(Math.random() * await this.RETURN_FLIGHT_LIST.count())
        console.log("AP Index on FP: ", await this.departure_flight_index)
        await this.click_element(this.RETURN_FLIGHT_LIST, await this.arrival_flight_index)
    }
    
    // select_fare_package = async () => {
    //     const index = Math.floor(Math.random() * this.FARE_PACKAGES.length)
    //     await this.click_element(this.FARE_PACKAGES[index])
    //     if (index === 0) {
    //         await this.click_element(this.CONTINIUE_WITH_BASIC_PACKAGE)
    //     }
    // }

    select_basic_package = async () => {
        await this.click_element(this.PACKAGE_BASIC)
        await this.click_element(this.CONTINIUE_WITH_BASIC_PACKAGE)
    }

    click_login_later_button = async () => {
        await this.click_element(this.LOGIN_LATER_BUTTON)
    }

    select_title_mr = async () => {
        await this.click_element(this.TITLE_SELECT_DROPDOWN)
        await this.click_element(this.TITLE_MR)
    }

    enter_passenger_name = async () => {
        await this.input_text(this.NAME_INPUT, 'John')
        await this.input_text(this.SURNAME_INPUT, 'Doe')
    }

    click_continue_button = async () => {
        await this.click_element(this.CONTINUE_BUTTON)
        return new SeatsPage(this.page)
    }

    get_airport_names = async () => {
        try {
            const departure_airport = await this.get_element_text(this.DEPARTURE_AND_RETURN_AIRPORT)
            const arrival_airport = await this.get_element_text(this.DEPARTURE_AND_RETURN_AIRPORT, 1)
            return {departure_airport, arrival_airport}
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get airport names: ${error.message}`)
            } else {
                throw new Error("Failed to get airport names")
            }
        }
    }

    get_ticket_prices_for_flight = async (index) => {
        return await this.get_ticket_price(this.SINGLE_TICKET_PRICE, index)
    }

    get_flight_details = async () => {
      try {
        const text = await this.get_element_text(this.FLIGHT_DETAILS_SUMMARY)
        const regex = /^(\w+)\n(\d{1,2} \w+)\n - (\d{1,2} \w+)\n(\d+)$/
    
        const match = text.match(regex)
        if (!match) {
          throw new Error(`Invalid text format: ${text}`)
        }
    
        return {
          trip_type: match[1]+" trip", departure_date: match[2], return_date: match[3], passenger_count: parseInt(match[4]),
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error occurred while parsing text: ${error.message}`)
        } else {
          console.error('An unknown error occurred')
        }
        return null
      }
    }
    

}


