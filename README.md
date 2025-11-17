# Coding Challenge - Mine Site Truck Tracking System

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10.

## Overview

This project is made to showcase software development process, structure and technical solutioning.

## Software Development Process

This project was constructed with unit testing covering all critical requirements.

It follows three guiding patterns:

1. Semantic HTML
2. Smart and dumb component architecture
3. Separation of concerns

## Structure

### Architecture

The project is structured according to three concerns, each following a distinct responsibility:

1. Map Definition (map-definition, map-service, mock-map-definition) - responsible for defining the contents of the map ("what to render").

2. Map View (map-component) - responsible for how the map is rendered ("what the map looks like").

3. Truck Simulator (truck-simulator-service) - responsible for pushing real-time updates to the map ("when to render").

### Project Structure

This Angular application is divided into four folders:

1. services - contains the programs that need their state to be shared across the application.

2. component - contains the map renderer.

3. mock-data - contains the sample map file used for the application and unit testing.

4. models - contains the interfaces that serve as a common contract for the services and the components to communicate.

## Technical Solutioning

This project uses what is known as a clipping margin.

The clipping margin is a technical solution to the clipping problem.

The clipping problem happens when objects are not rendered fully ("clipped") when positioned at the edges of the map.

The clipping margin expands the original dimensions of the map to allow the clipped objects to render fully.

## Unit Testing Scenarios and Results

Unit testing covers 17 scenarios.

13 of which are critical scenarios in the technical requirements document.

Clipping margin is included as it is considered critical to user experience.

The remaining 4 scenarios are basic tests for creation.

![Karma unit testing results](./markdown/unit_testing.png)
