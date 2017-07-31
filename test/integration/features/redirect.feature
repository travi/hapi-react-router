Feature: route results in a redirect

  Scenario: temporary redirect
    When a request is made for a route that temporarily redirects to another route
    Then the response redirects to the new route

  Scenario: permanent redirect
    When a request is made for a route that permanently redirects to another route
    Then the response redirects to the new route

  Scenario: default redirect
    When a request is made for a route that redirects to another route
    Then the response redirects to the new route
