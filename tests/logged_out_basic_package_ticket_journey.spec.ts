import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'


test('single user logged out basic package ticket journey', async ({ page }) => {

   //This test is for the logged out users who book basic package in ticket selection in a return trip

   //TEST VARIABLES
   const baseURL = 'https://www.ryanair.com/tr/en'

   let departure_city = 'London'
   let departure_airport = 'London Stansted'
   let arrival_city = 'Italy'
   let arrival_airport = 'Milan Bergamo'
   let selected_trip_type = 'Return trip' //or 'One way trip'
   let passenger_count = 0 
   let departure_day 
   let return_day  
   let number_of_adults = 1
   let selected_fare_package = 'BASIC' //or 'REGULAR', 'PLUS', 'FLEXI PLUS'



   await page.goto(baseURL)
   const homePage = new HomePage(page)
   expect(page).toHaveURL(baseURL)
   await homePage.accept_cookies()
   await homePage.set_departure_city(departure_city, departure_airport)
   await homePage.set_arrival_city(arrival_city, arrival_airport)
   const trip_type = await homePage.get_trip_type_text()
   expect(selected_trip_type).toBe(trip_type)
   await homePage.set_flight_dates()
   await homePage.set_number_of_passengers(number_of_adults)
   passenger_count = await homePage.get_total_passenger_count()
   expect (passenger_count).toBe(await homePage.get_total_passenger_count())
   departure_day = (await homePage.get_flight_days())?.departure_date
   return_day = (await homePage.get_flight_days())?.return_date
   
   
   const flightsPage = await homePage.click_search_flight_button()
   await page.waitForLoadState('networkidle')
   //await page.waitForTimeout(2000)
   expect((await flightsPage.get_airport_names()).departure_airport).toBe(departure_airport)
   expect((await flightsPage.get_airport_names()).arrival_airport).toBe(arrival_airport)
   expect((await flightsPage.get_flight_details())?.trip_type).toMatch(trip_type)
   expect((await flightsPage.get_flight_details())?.departure_date).toBe(departure_day)
   expect((await flightsPage.get_flight_details())?.return_date).toBe(return_day)
   expect((await flightsPage.get_flight_details())?.passenger_count).toBe(passenger_count)

   const departure_ticket_price = await flightsPage.get_ticket_prices_for_flight(await flightsPage.DEPARTURE_FLIGHT_INDEX)
   await flightsPage.select_departure_flight()
   expect(departure_ticket_price).toBe(await flightsPage.get_cart_total())
   const arrival_ticket_price = await flightsPage.get_ticket_prices_for_flight(await flightsPage.ARRIVAL_FLIGHT_INDEX)
   await flightsPage.select_return_flight()
   expect(+arrival_ticket_price + +departure_ticket_price).toBe +(await flightsPage.get_cart_total()) //buna sonra bak
   await flightsPage.select_fare_package_by_name(selected_fare_package)
   expect (selected_fare_package).toBe(await flightsPage.get_selected_fare_package_title())
   await flightsPage.click_login_later_button()
   await flightsPage.select_random_passenger_title()
   await flightsPage.enter_passenger_details()

   const seatsPage = await flightsPage.click_continue_button()
   await page.waitForLoadState('networkidle')
   await seatsPage.select_random_seat()
   await seatsPage.click_next_flight()
   await seatsPage.select_random_seat()
   await seatsPage.click_continue_button()

   const bagsPage = await seatsPage.decline_fast_track()
   await bagsPage.select_small_bag()

   const extrasPage = await bagsPage.click_continue_button()
   await extrasPage.click_add_insurance_button()
   await extrasPage.select_standard_insurance()
   await extrasPage.click_done_button()
   await extrasPage.click_continue_button()

})




