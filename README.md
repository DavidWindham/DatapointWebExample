# Datapoint Web Example
An interactive example of the datapoint API from the Met office using D3.js and powered by Flask on the backend. Styled with bootstrap.

## Note
An API key is NOT needed, but you will be limited to 20 forecast locations and forecast data collected on 01/10/21.

## Usage
### Basic requirements
Not required but for full functionality, sign up and request an API key from Datapoint here: https://www.metoffice.gov.uk/services/data/datapoint and copy it into the .ENV file.

### Example.py
Example.py gives a quick insight into the datapoint API, only the [requests library](https://github.com/psf/requests) is needed for this script.

### Flask application
"pip install -r requirements.txt" and run the application with "python app.py". Everything else is provided or is delivered via CDN.

### Datapoint API
Use the datapoint_api.py and datapoint_functions.py in your own project, it's been designed to have 0 dependencies outside of these 2 files (other than the requests library).

### Dataclasses
If you wish to use the classes found in dataclasses.py in your own project , you may need to remove the icon handling aspect as this is specific to this application. Remove the IconHandler inheritance on the ForecastSinglePoint class and the respective import. Currently classes only exist to handle forecast data, pass forecast data for a location into the class ForecastData and use from there.

### Icon Handler
The Icon handler has been kept as separate as possible to allow you to change to another icon pack if you wish. I can't guarantee CSS support for different packs as this is untested, but as the rendering happens server side from within the IconHandler class, it should be a simple swap within the icon_handler.py file. There are some uses of weather icons in templates that exist outside of this though, I may re-write those areas to remove this messy dependency.


## Credit
* [Met Office Datapoint](https://www.metoffice.gov.uk/services/data/datapoint)
* [Martinjc UK-TopoJSON Data](https://martinjc.github.io/UK-GeoJSON)
* [ErikFlowers Weather Icons](https://github.com/erikflowers/weather-icons)


## Licensing
* Code licensed under [MIT License](https://opensource.org/licenses/mit-license.html)
