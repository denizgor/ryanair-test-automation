import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'


test.skip('single user logged out basic package ticket journey', async ({ page }) => {


//This test is for the logged out users who book basic package for multiple passengers in ticket selection

   //TEST VARIABLES
   const baseURL = 'https://www.ryanair.com/tr/en'

   let departure_city = 'London'
   let departure_airport = 'London Stansted'
   let arrival_city = 'Italy'
   let arrival_airport = 'Milan Bergamo'
   let trip_type = 'Return trip'
   let passenger_count = 0 
   let departure_day = ''
   let return_day = ''
   let number_of_adults = 1
   let number_of_teens = 0
   let number_of_children = 0
   let number_of_infants = 0

})