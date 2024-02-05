# Schema

Documented below is the schema for __Charge City__, please note not all classes are documented here. 

___This is a live document and will keep on adding to it as and when required___


1. Locations
2. Chargers (New)
3. User
4. ChargeSession
5. Transactions
6. CP_Vendor (New)
7. ConnectorType (New)
8. EV_Manufacturer (New)
9. Cars (New)
10. Installation (New)

---

### Locations

| Name | Type | Detail |
| :----: | :----: | :---: |
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| Name | String |
| Address | String |
| Description | String |
| ConnectorType | Array | _[String]_ |
| CurrentType | Array | _[String]_ |
| OpenTime | String | _hh:mm a_ |
| CloseTime | String | _hh:mm a_ |
| GeoLocation | GeoPoint | _Refer Docs_|
| Banner | File | _Refer Docs_|
| is24hrs | Boolean|
| isEnabled | Boolean |
| --- |
| City | String |
| State | String |
| LocationType | String |
| --- |
| ElectricityTariff | Number | */kWh* |
| RevenueModel | String | *Rental / Sharing* |
| RevenueSharingType | String | *Percentage / Flat* |
| RevenueAmount | Number | 

---

### Chargers

This class provides the information regarding all the ChargePoints at a given Location.

| Name | Type | Detail |
:----- | ----- | ---
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| Vendor | Pointer | [ _Pointer -> CP Vendor_ ] |
| Location | Pointer | [ _Pointer -> Locations_ ] |
| ConnectorType | Pointer | [ _Pointer -> ConnectorType_ ] |
| Serial | String |
| Power | String |
| Connector | String |  ***Deprecated*** |
| Cost | Number |
| TaxRate | Number |
| inclusiveTax | Boolean |
| isOCPP | Boolean |
| ChargeId | String | *OCPP Charger Identifier* |
| CPID | String | *Non OCPP EO Chargers Id* | 

---


### User

This is a system class and can only be accessed using __ParseUser.class__ or __ParseUser__

###### Core fields such as __username__, __password__, __email__ and so on are not accessible using Queries

| Name | Type | Detail |
:----- | ----- | ---
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| FullName | String |
| Phone | String |
| EV | Array | *-> Cars* ] |

---

### ChargeSession

_This only includes the data that is being currently used for development of the dashboard, this list will increase once we require more data._

| Name | Type | Detail |
|:-----: | :-----: | :---: |
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| Live | Boolean |
| User | Pointer | _-> User_|
| Vehicle | Pointer | _-> Cars_|
| Location | Pointer | _-> Locations_|
| ChargePoint | Pointer | _-> Chargers_|
| RangeAdded | Number | 
| TotalTimeConsumed | Number | 
| TotalEnergyConsumed | Number | 
| TotalCost | Number | 

---

### Transactions

| Name | Type | Detail |
:----- | ----- | --- |
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| User | Pointer | _-> User_|
| Amount | Number |
| Type | String | _Credit/Debit_
| Detail | String | _Small description of the transactoin_ |
| RazorPayId | String | _If a __CREDIT__, the Transaction Id from Payment Gateway_ |

---

### CP_Vendor

This class provides the data for all the ChargePoint Vendors or Manufacturers.

__Please add an option in the Dashboard to View and Create Vendors__

| Name | Type | Detail |
:----- | ----- | ---
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| Name | String | _Short Name_ | 
| TradeName | String | _Name of company_ |
| Alias | String | _Other Names (if any)_ |

---

### ConnectorType

This class provides the data for all the Connectors

| Name | Type | Detail |
:----- | ----- | ---
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| Name | String | _Short Name_ | 
| Image | ParseFile |
| CurrentType | String | *AC / DC* |
| isEnabled | Boolean |

---

### EV_Manufacturer

This class provides the data for all the EV Manufacturers

| Name | Type | Detail |
:----- | ----- | ---
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| Name | String |
| Logo | ParseFile |
| isEnabled | Boolean |

---

### Cars

This class provides the data for all the Electric Vehicles

| Name | Type | Detail |
:----- | ----- | ---
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| Name | String | *Car Name* | 
| Image | ParseFile | *Car Image* |
| Manufacturer | String | ***Deprecated*** |
| ManufacturerLogo | ParseFile | ***Deprecated*** |
| Brand | Pointer | *-> EV_Manufacturer* |
| ChargingRate | Number | 
| RangePerKW | Number |  
| displayCar | Boolean |

---

### Installation

This is a system generated class and is to be used to send Push Notifications. This class can be queried and accessed using __ParseInstallation__

| Name | Type | Detail |
:----- | ----- | ---
| objectId | String| __Core__ |
| createdAt | Date | __Core__ |
| updatedAt | Date | __Core__ |
| User | Pointer | *-> User* | 
| deviceType | String | *ios / android* |
| appVersion | String | *Current build being run* |

---
