# Locations
## Add New Location

```
(async () => {
  const myNewObject = new Parse.Object('Locations');
  myNewObject.set('Name', 'A string');
  myNewObject.set('Description', 'A string');
  myNewObject.set('is24hrs', true);
  myNewObject.set('Address', 'A string');
  myNewObject.set('GeoLocation', new Parse.GeoPoint({latitude: 40.0, longitude: -30.0}));
  myNewObject.set('Logo', new Parse.File("resume.txt", { base64: btoa("My file content") }));
  myNewObject.set('OpenTime', 'A string');
  myNewObject.set('CloseTime', 'A string');
  myNewObject.set('Amenities', [1, 'a string']);
  myNewObject.set('HubId', 'A string');
  myNewObject.set('ConnectorType', [1, 'a string']);
  myNewObject.set('Banner', new Parse.File("resume.txt", { base64: btoa("My file content") }));
  myNewObject.set('CurrentType', [1, 'a string']);
  myNewObject.set('hasRestrictedAccess', true);
  myNewObject.set('isEnabled', true);
  myNewObject.set('Client', 'A string');
  myNewObject.set('OCPPEnabled', true);
  myNewObject.set('City', 'A string');
  myNewObject.set('State', 'A string');
  myNewObject.set('LocationType', 'A string');
  try {
    const result = await myNewObject.save();
    // Access the Parse Object attributes using the .GET method
    console.log('Locations created', result);
  } catch (error) {
    console.error('Error while creating Locations: ', error);
  }
})();

```

## Edit Location
```
(async () => {
  const query = new Parse.Query(Locations);
  try {
    // here you put the objectId that you want to update
    const object = await query.get('xKue915KBG');
    object.set('Name', 'A string');
    object.set('Description', 'A string');
    object.set('is24hrs', true);
    object.set('Address', 'A string');
    object.set('GeoLocation', new Parse.GeoPoint({latitude: 40.0, longitude: -30.0}));
    object.set('Logo', new Parse.File("resume.txt", { base64: btoa("My file content") }));
    object.set('OpenTime', 'A string');
    object.set('CloseTime', 'A string');
    object.set('Amenities', [1, 'a string']);
    object.set('HubId', 'A string');
    object.set('ConnectorType', [1, 'a string']);
    object.set('Banner', new Parse.File("resume.txt", { base64: btoa("My file content") }));
    object.set('CurrentType', [1, 'a string']);
    object.set('hasRestrictedAccess', true);
    object.set('isEnabled', true);
    object.set('Client', 'A string');
    object.set('OCPPEnabled', true);
    object.set('City', 'A string');
    object.set('State', 'A string');
    object.set('LocationType', 'A string');
    try {
      const response = await object.save();
      // You can use the "get" method to get the value of an attribute
      // Ex: response.get("<ATTRIBUTE_NAME>")
      // Access the Parse Object attributes using the .GET method
      console.log(response.get('Name'));
      console.log(response.get('Description'));
      console.log(response.get('is24hrs'));
      console.log(response.get('Address'));
      console.log(response.get('GeoLocation'));
      console.log(response.get('Logo'));
      console.log(response.get('OpenTime'));
      console.log(response.get('CloseTime'));
      console.log(response.get('Amenities'));
      console.log(response.get('HubId'));
      console.log(response.get('ConnectorType'));
      console.log(response.get('Banner'));
      console.log(response.get('CurrentType'));
      console.log(response.get('hasRestrictedAccess'));
      console.log(response.get('isEnabled'));
      console.log(response.get('Client'));
      console.log(response.get('OCPPEnabled'));
      console.log(response.get('City'));
      console.log(response.get('State'));
      console.log(response.get('LocationType'));
      console.log('Locations updated', response);
    } catch (error) {
      console.error('Error while updating Locations', error);
      }
    } catch (error) {
      console.error('Error while retrieving object Locations', error);
    }
})();

```
