Feature: error

  Scenario: Server Error
    When a request is made for a route that fails to load data
    Then a server-error response is returned

  Scenario: non-matching route
    When a request is made for a route that does not exist
    Then a not-found response is returned
