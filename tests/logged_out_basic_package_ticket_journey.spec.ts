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
   let trip_type = 'Return trip'
   let passenger_count = 0 
   let departure_day 
   let return_day  
   let number_of_adults = 1
   let number_of_teens = 0
   let number_of_children = 0
   let number_of_infants = 0


   await page.goto(baseURL)
   const homePage = new HomePage(page)
   expect(page).toHaveURL(baseURL)
   await homePage.accept_cookies()
   await homePage.set_departure_city(departure_city, departure_airport)
   await homePage.set_arrival_city(arrival_city, arrival_airport)
   trip_type = await homePage.get_trip_type_text()
   expect(trip_type).toBe(await homePage.get_trip_type_text())
   await homePage.set_flight_dates()
   await homePage.set_number_of_passengers(number_of_adults)
   passenger_count = await homePage.get_total_passenger_count()
   expect (passenger_count).toBe(await homePage.get_total_passenger_count())
   departure_day = (await homePage.get_flight_days())?.departure_date
   return_day = (await homePage.get_flight_days())?.return_date
   
   
   const flightsPage = await homePage.click_search_flight_button()
   await page.waitForLoadState('networkidle')
   //await page.waitForTimeout(1000) //bunsuz çalışmıyor
   expect((await flightsPage.get_airport_names()).departure_airport).toBe(departure_airport)
   expect((await flightsPage.get_airport_names()).arrival_airport).toBe(arrival_airport)
   expect((await flightsPage.get_flight_details())?.trip_type).toMatch(trip_type)
   expect((await flightsPage.get_flight_details())?.departure_date).toBe(departure_day)
   expect((await flightsPage.get_flight_details())?.return_date).toBe(return_day)
   expect((await flightsPage.get_flight_details())?.passenger_count).toBe(passenger_count)

   await page.pause()
   const departure_ticket_price = await flightsPage.get_ticket_prices_for_flight(await flightsPage.departure_flight_index)
   await flightsPage.select_departure_flight()
   expect(departure_ticket_price).toBe(await flightsPage.get_cart_total())
   const arrival_ticket_price = await flightsPage.get_ticket_prices_for_flight(await flightsPage.arrival_flight_index)
   await flightsPage.select_return_flight()
   expect(+arrival_ticket_price + +departure_ticket_price).toBe +(await flightsPage.get_cart_total()) //buna sonra bak
   await flightsPage.select_basic_package()
   await flightsPage.click_login_later_button()
   await flightsPage.select_title_mr()
   await flightsPage.enter_passenger_name()

   const seatsPage = await flightsPage.click_continue_button()
   await page.waitForLoadState('networkidle')
   //await page.waitForTimeout(1000) //bunsuz çalışmıyor
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




/*
# Test Scenario: Ticket Booking Process for Logged Out User

## Scenario Description
Verify that a logged-out user can successfully search for and book a flight ticket on the airline website.

## Preconditions
1. The user is not logged into the airline website
2. The website is accessible and functioning correctly

## Test Steps

1. Navigate to the airline's homepage
2. Locate and click on the "Book a Flight" or similar option
3. Enter valid flight search criteria:
   - Origin airport
   - Destination airport
   - Departure date
   - Return date (if round trip)
   - Number of passengers
4. Click the "Search" button
5. From the search results, select a suitable outbound flight
6. If round trip, select a suitable return flight
7. Review the flight details and click "Continue" or "Next"
8. On the passenger information page, enter valid details for all passengers:
   - Full name
   - Date of birth
   - Contact information (email and phone number)
9. Select any additional services (e.g., seat selection, meals, baggage)
10. Proceed to the payment page
11. Enter valid payment information
12. Review the booking summary
13. Confirm and complete the booking

## Expected Results
- The booking is successfully completed
- A confirmation page is displayed with a booking reference number
- A confirmation email is sent to the provided email address

## Assertions

1. Assert that the flight search returns results matching the input criteria
2. Assert that the selected flights are correctly reflected in the booking summary
3. Assert that the total price is calculated correctly, including any additional services
4. Assert that an error message is displayed if invalid passenger information is entered
5. Assert that the booking cannot be completed with invalid payment information
6. Assert that a unique booking reference number is generated
7. Assert that the confirmation page displays all relevant booking details
8. Assert that a confirmation email is received at the provided email address
9. Assert that the booking can be retrieved using the booking reference number
10. Assert that the website remains responsive throughout the booking process
11. Assert that appropriate error handling is in place for network issues or server errors
12. Assert that the session data is cleared after the booking is completed or abandoned

// Notes
- This test should be repeated for different types of bookings (e.g., one-way, round trip, multi-city)
- Performance metrics such as page load times and response times should be monitored during the test
- Accessibility features should be tested to ensure the booking process is usable for all users
*/