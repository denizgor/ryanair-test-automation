import { BaseFunctions } from "../base/base_functions"
import { Page } from "@playwright/test"
import { FlightsPage } from "./FlightsPage"
import { error } from "console"

export class HomePage extends BaseFunctions {
    constructor(page: Page) {
        super(page)
    }
    
    //LOCATORS
    ACCEPT_COOKIES_BUTTON = this.page.locator('[data-ref="cookie.accept-all"]')
    DEPARTURE_FIELD = this.page.locator('#input-button__departure')
    ARRIVAL_FIELD = this.page.locator('#input-button__destination')
    RETURN_TRIP_RADIO_BUTTON = this.page.locator('#ry-radio-button--1')
    RETURN_TRIP_RADIO_BUTTON_TEXT = this.page.locator('[for="ry-radio-button--1"]')
    ONE_WAY_TRIP_RADIO_BUTTON = this.page.locator('#ry-radio-button--0')
    ONE_WAY_TRIP_RADIO_BUTTON_TEXT = this.page.locator('[for="ry-radio-button--0"]')
    FLIGHT_DATES = this.page.locator('[data-ref="input-button__display-value"]')
    FLIGHT_DAYS = this.page.locator('.calendar-body__cell:not([class*="--disabled"])')
    SEARCH_FLIGHT_BUTTON = this.page.getByRole( "button",{ name: "Search" })
    INCREASE_PASSENGER_COUNT_BUTTON = this.page.locator('[data-ref="counter.counter__increment"]')
    DECREASE_PASSENGER_COUNT_BUTTON = this.page.locator('[data-ref="counter.counter__decrement"]')
    PASSENGER_NUMBER_COUNTER = this.page.locator('[data-ref="counter.counter__value"]')
    TOTAL_PASSENGER_NUMBER = this.page.locator('[data-ref="input-button__passengers"]')
    INFANT_INFO_BUTTON = this.page.locator('[aria-label="Ok, got it"]')

    //FUNCTIONS
    accept_cookies = async () => {
        await this.click_element(this.ACCEPT_COOKIES_BUTTON)
    }
    
    set_airport_locator = async (departure_airport: string) => {
        return this.page.getByText(departure_airport)
    }
    
    set_departure_city = async (departure_city: string, departure_airport, index: number = 0) => {
        await this.DEPARTURE_FIELD.clear()
        await this.click_element(this.DEPARTURE_FIELD)
        await this.input_text(this.DEPARTURE_FIELD, departure_city)
        await this.click_element(await this.set_airport_locator(departure_airport))
    }

    set_arrival_city = async (arrival_city: string, arrival_airport, index: number = 0) => {
        await this.input_text(this.ARRIVAL_FIELD, arrival_city)
        await this.click_element(await this.set_airport_locator(arrival_airport))

    }

    set_flight_dates = async() => {
        await this.pick_flight_dates(this.FLIGHT_DAYS)
    }

    
    get_flight_days = async () => {
      try {
        const departure_day = await this.get_element_text(this.FLIGHT_DATES, 2)
        const return_day = await this.get_element_text(this.FLIGHT_DATES, 3)
        const regex = /, (.*)/
        const departure_date = departure_day.match(regex)?.[1]
        const return_date = return_day.match(regex)?.[1]
        return { departure_date, return_date,}
      } catch (error) {
        if (error instanceof Error) {
            console.error(`Error occurred while parsing text: ${error.message}`)
          } else {
            console.error('An unknown error occurred')
          }
        return null
      }
    }

    
    set_trip_type = async (trip_type: string) => {
        await this.click_element(trip_type === "Return trip" ? this.RETURN_TRIP_RADIO_BUTTON 
            : this.ONE_WAY_TRIP_RADIO_BUTTON);
      }

    get_trip_type_text = async (): Promise<string> => {
        
        try {
            if (await this.RETURN_TRIP_RADIO_BUTTON.isChecked()){
                return await this.get_element_text(this.RETURN_TRIP_RADIO_BUTTON_TEXT)
            } else if ( await this.ONE_WAY_TRIP_RADIO_BUTTON.isChecked()) {
                return await this.get_element_text(this.ONE_WAY_TRIP_RADIO_BUTTON_TEXT)
            }            
        } catch (error) {
            console.log(error)
            return "Trip type not selected"
        }
        return "Undefined trip type"

    }

    
    set_number_of_passengers = async (adults: number, teens: number = 0, children: number = 0, infants: number = 0) => {
        const passengerTypes = [adults, teens, children, infants]
        try{
            for (let index = 0; index < passengerTypes.length; index++) {
                const currentCount = parseInt(await this.get_element_text(this.PASSENGER_NUMBER_COUNTER, index))
                const difference = passengerTypes[index] - currentCount
                const button = difference > 0 ? this.INCREASE_PASSENGER_COUNT_BUTTON : this.DECREASE_PASSENGER_COUNT_BUTTON
        
                for (let clickCount = 0; clickCount < Math.abs(difference); clickCount++) {
                    await this.click_element(button, index);

                    if (await this.INFANT_INFO_BUTTON.isVisible()) {
                        await this.click_element(this.INFANT_INFO_BUTTON)
                    }
                }
            }
        } catch (error) {
            console.log(error)
            throw new Error("Passenger count not set")
        }
    }

    get_total_passenger_count = async ():Promise<number> => {
        let totalPassengers = 0
        try {
          const passenger_count = await this.get_element_text(this.TOTAL_PASSENGER_NUMBER)
          const digits = passenger_count.match(/\d+/g)
          if (digits) {
            digits.forEach(digit => {
              totalPassengers += parseInt(digit)
            })
            
        } else {
            throw new Error('No digits found in the passenger count text')
        }
    } catch (error) {
        console.error('Error calculating total passengers:', error.message)
    }
    return totalPassengers
    
    }
    
    click_search_flight_button = async () => {
        await this.click_element(this.SEARCH_FLIGHT_BUTTON)
        return new FlightsPage(this.page)
    }    

}


