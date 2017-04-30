Feature: error

  Scenario: Server Error

  Scenario: non-matching route
    When a request is made for a route that does not exist
    Then a not-found response is returned
