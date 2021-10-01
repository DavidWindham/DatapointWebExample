# Datapoint Web Example
An interactive example of the datapoint API from the Met office using D3.js and powered by Flask on the backend. Styled with bootstrap.

## Note
I'll likely modify the API to return some previously aquired data if the API key isn't set so you can sample this application without needing to gather an API key. Currently this is not implemented.

## Usage
### Basic requirements
Sign up and request an API key from Datapoint here: https://www.metoffice.gov.uk/services/data/datapoint and copy it into the .ENV file.

### Example.py
Example.py gives a quick insight into the datapoint API, only the requests library is needed for this script.

To use the API interface in your own project, simply pull the datapoint_api.py and datapoint_functions.py files out of the api_handler folder and implement it in your own project. 

### Dataclasses
If you also wish to use the dataclasses, you may need to remove the icon handling aspect as this is specific to this application. Remove the IconHandler inheritance on the ForecastSinglePoint class and the respective import. Currently classes only exist to handle forecast data, pass forecast data for a location into the class ForecastData and use from there.

### Icon Handler
The Icon handlers have been kept as separate as possible to allow you to change to another icon pack if you wish. I can't guarantee CSS support for different packs as this is untested, but as the rendering happens server side from within the IconHandler class, it should be a simple swap within the icon_handler.py file.

## Flask application

Pip -r the requirements.txt and run the application with "python app.py". Everything else is provided or is delivered via CDN. 




## Credit
* [Met Office Datapoint](https://www.metoffice.gov.uk/services/data/datapoint)
* [Martinjc UK-TopoJSON Data](https://martinjc.github.io/UK-GeoJSON)
* [ErikFlowers Weather Icons](https://github.com/erikflowers/weather-icons)


## Licensing
* Code licensed under [MIT License](https://opensource.org/licenses/mit-license.html)
