Feature: render

  Scenario: matched route
    When a request is made for an existing route
    Then the route is rendered successfully
    And asynchronously fetched data is included in the page
