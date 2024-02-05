
# Charge Sessions Filters

Documented below are 3 types of filters based on the following -

1. Location 
2. ChargePoint
3. Status (_Charging / Completed_)
3. User Account
4. Dates

Before starting please refer to the SCHEMA

To initialise we create a __ChargeSession__ Query object
`const parseQuery = new Parse.Query("ChargeSessions");`

To sort the query in descending order

`parseQuery.descending("createdAt);`

Since we are accessing data from pointers to other classes we request access to them through our query request.

```
parseQuery.include("Location");
parseQuery.include("ChargePoint");
parseQuery.include("Vehicle");
parseQuery.include("User");

```

---

### Locations

_For this example we are assuming the location to be Select CITYWALK_

We create an object for the __Locations__ class and add it to the query in this manner

```
var Location = Parse.Object.extend("Locations");
var locationObj = Location.createWithoutData(OBJECTID OF LOCATIONS OBJ);

parseQuery.equalTo("Location", locationObj);
```		
---

### Charge Point

We create an object for the __ChargePoint__ class and add it to the query in this manner

```
var CP = Parse.Object.extend("Chargers");
var chargerObj = CP.createWithoutData(OBJECTID OF CHARGERS OBJ);

parseQuery.equalTo("ChargePoint", chargerObj);
```		
---

### Status

###### _For Live Session_

`parseQuery.equalTo("Live", true);`

###### _For Completed Session_

`parseQuery.equalTo("Live", false);`

---

### User

We create an object for the __User__ class and add it to the query in this manner

```
var User = Parse.User;
var userObj = User.createWithoutData(USER OBJECT ID)

parseQuery.equalTo("User", userObj);
```		
---

### Dates

We need a __STARTDATE__ & __ENDDATE__ to process it through

```
parseQuery.greaterThanOrEqualTo(STARTDATE);
parseQuer.lessThanOrEqualTo(ENDDATE);

```
---


