Feature: Login
  As a registered user
  I want to sign in to the application
  So that I can access my account dashboard

  Background:
    Given I navigate to the login page

  Scenario: Successful login with valid credentials
    When I login with valid credentials
    Then I should see the dashboard

  Scenario: Login with invalid credentials shows an error
    When I login with invalid credentials
    Then I should see an error message
