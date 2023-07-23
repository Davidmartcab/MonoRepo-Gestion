## API Endpoints

This README file provides an explanation of the API endpoints along with the necessary headers, body, and responses for each endpoint.
### GET /

This endpoint is used to check if the API is running and to get a validation token.
#### Headers:

None
#### Body:

None
#### Responses: 
- **200 OK** 

```json

{
  "message": "Api is running!",
  "validationToken": "your_generated_validation_token"
}
```
### POST /create

This endpoint is used to create a new item.
#### Headers: 
- `validationtoken`: The validation token obtained from the GET `/` endpoint.
#### Body:

```json

{
  "names": ["name1", "name2", "name3"]
}
```


#### Responses: 
- **200 OK** 

```json

{
  "message": "Created!",
  "data": ["name1", "name2", "name3"],
  "token": "your_new_validation_token",
  "code": "your_generated_code"
}
``` 
- **400 Bad Request** 

```json

{
  "message": "Invalid token!"
}
```
### POST /connect

This endpoint is used to connect to an existing item.
#### Headers: 
- `code`: The code of the item to connect to. 
- `validationtoken`: The validation token obtained from the GET `/` endpoint.
#### Body:

None
#### Responses: 
- **200 OK** 

```json

{
  "message": "Connected!",
  "data": ["name1", "name2", "name3"],
  "token": "your_new_validation_token",
  "code": "your_item_code"
}
``` 
- **400 Bad Request** 

```json

{
  "message": "Invalid token!"
}
``` 
- **404 Not Found** 

```json

{
  "message": "Item not found!"
}
```
### GET /items

This endpoint is used to get a list of items.
#### Headers: 
- `token`: The validation token obtained from the GET `/` endpoint.
#### Body:

None
#### Responses: 
- **200 OK** 

```json

{
  "message": "Items found!",
  "data": {
    "itemsList": [
      {
        "uuid": "item_uuid",
        "title": "Item Title",
        "payer": "Payer Name",
        "amount": 100,
        "debtors": ["Debtor1", "Debtor2"],
        "createdAt": "item_creation_date"
      },
      {
        "uuid": "item_uuid",
        "title": "Item Title",
        "payer": "Payer Name",
        "amount": 150,
        "debtors": ["Debtor3", "Debtor4"],
        "createdAt": "item_creation_date"
      }
    ],
    "deudas": {
      "Payer Name": {
        "Debtor1": 50,
        "Debtor2": -50
      },
      "Payer Name": {
        "Debtor3": 75,
        "Debtor4": -75
      }
    }
  },
  "token": "your_new_validation_token"
}
``` 
- **400 Bad Request** 

```json

{
  "message": "Invalid token!"
}
``` 
- **404 Not Found** 

```json

{
  "message": "Item not found!"
}
```
### POST /items

This endpoint is used to add a new item to the list.
#### Headers: 
- `token`: The validation token obtained from the GET `/` endpoint.
#### Body:

```json

{
  "title": "Item Title",
  "payer": "Payer Name",
  "amount": 100,
  "debtors": ["Debtor1", "Debtor2"]
}
```


#### Responses: 
- **200 OK** 

```json

{
  "message": "Item added!",
  "token": "your_new_validation_token"
}
``` 
- **400 Bad Request** 

```json

{
  "message": "Invalid token!"
}
``` 
- **404 Not Found** 

```json

{
  "message": "Item not found!"
}
```

Please note that this documentation assumes that the implementation of the endpoints and their dependencies is correct based on the provided code. Make sure to handle edge cases and error scenarios appropriately in the actual implementation.