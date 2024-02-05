# Chargers
## Add New Charger

```
(async () => {
  const myNewObject = new Parse.Object('Chargers');
  myNewObject.set('CPID', 'A string');
  myNewObject.set('Serial', 'A string');
  myNewObject.set('Location', new Parse.Object("Locations"));
  myNewObject.set('Brand', 'A string');
  myNewObject.set('Connector', 'A string');
  myNewObject.set('Power', 'A string');
  myNewObject.set('Cost', 1);
  myNewObject.set('ChargeId', 'A string');
  myNewObject.set('Vendor', new Parse.Object("CP_Vendor"));
  myNewObject.set('isOCPP', true);
  myNewObject.set('isEnabled', true);
  myNewObject.set('inclusiveTax', true);
  myNewObject.set('TaxRate', 1);
  myNewObject.set('ConnectorType', new Parse.Object("ConnectorTypes"));
  try {
    const result = await myNewObject.save();
    // Access the Parse Object attributes using the .GET method
    console.log('Chargers created', result);
  } catch (error) {
    console.error('Error while creating Chargers: ', error);
  }
})();
```

## Edit Charger
```
(async () => {
  const query = new Parse.Query(Chargers);
  try {
    // here you put the objectId that you want to update
    const object = await query.get('xKue915KBG');
    object.set('CPID', 'A string');
    object.set('Serial', 'A string');
    object.set('Location', new Parse.Object("Locations"));
    object.set('Brand', 'A string');
    object.set('Connector', 'A string');
    object.set('Power', 'A string');
    object.set('Cost', 1);
    object.set('ChargeId', 'A string');
    object.set('Vendor', new Parse.Object("CP_Vendor"));
    object.set('isOCPP', true);
    object.set('isEnabled', true);
    object.set('inclusiveTax', true);
    object.set('TaxRate', 1);
    object.set('ConnectorType', new Parse.Object("ConnectorTypes"));
    try {
      const response = await object.save();
      // You can use the "get" method to get the value of an attribute
      // Ex: response.get("<ATTRIBUTE_NAME>")
      // Access the Parse Object attributes using the .GET method
      console.log(response.get('CPID'));
      console.log(response.get('Serial'));
      console.log(response.get('Location'));
      console.log(response.get('Brand'));
      console.log(response.get('Connector'));
      console.log(response.get('Power'));
      console.log(response.get('Cost'));
      console.log(response.get('ChargeId'));
      console.log(response.get('Vendor'));
      console.log(response.get('isOCPP'));
      console.log(response.get('isEnabled'));
      console.log(response.get('inclusiveTax'));
      console.log(response.get('TaxRate'));
      console.log(response.get('ConnectorType'));
      console.log('Chargers updated', response);
    } catch (error) {
      console.error('Error while updating Chargers', error);
      }
    } catch (error) {
      console.error('Error while retrieving object Chargers', error);
    }
})();
```
