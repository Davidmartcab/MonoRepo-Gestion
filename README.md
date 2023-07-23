## API Gestion Cuentas

This README explains the endpoints, headers, request, response, and body of the provided NestJS controller named `AppController`.
### Endpoints: 
1. **/** :
- Description: This endpoint is used to check if the API is running and get a validation token.
- Method: GET 
- Request Headers:
- None 
- Request Body:
- None 
- Response:
- Status Code: 200 (OK) 
- Response Body:

```json

{
  "message": "Api is running!",
  "validationToken": "<generated_validation_token>"
}
``` 
2. **/create** :
- Description: This endpoint is used to create a new item.
- Method: POST 
- Request Headers: 
- `validationtoken`: A validation token obtained from the GET `/` endpoint. 
- Request Body:

```json

{
  "names": ["name1", "name2", "..."]
}
``` 
- Response:
- Status Code: 200 (OK) 
- Response Body:

```json

{
  "message": "Created!",
  "data": ["name1", "name2", "..."],
  "token": "<generated_new_token>",
  "code": "<generated_item_code>"
}
``` 
3. **/connect** :
- Description: This endpoint is used to connect to an existing item by providing the item code.
- Method: POST 
- Request Headers: 
- `validationtoken`: A validation token obtained from the GET `/` endpoint. 
- `code`: The item code to connect to. 
- Request Body:
- None 
- Response:
- Status Code: 200 (OK) 
- Response Body:

```json

{
  "message": "Connected!",
  "data": ["name1", "name2", "..."],
  "token": "<generated_new_token>"
}
``` 
- Status Code: 404 (Not Found) - If the item with the provided code is not found.

```json

{
  "message": "Item not found!"
}
``` 
4. **/items** :
- Description: This endpoint is used to get the list of items and their debts associated with a given item code.
- Method: GET 
- Request Headers: 
- `token`: A validation token obtained from the GET `/` endpoint or POST `/connect` endpoint. 
- Request Body:
- None 
- Response:
- Status Code: 200 (OK) 
- Response Body:

```json

{
  "message": "Items found!",
  "data": {
    "itemsList": [
      {
        "uuid": "<item_uuid>",
        "title": "<item_title>",
        "payer": "<payer_name>",
        "amount": <item_amount>,
        "debtors": ["debtor1", "debtor2", "..."],
        "createdAt": "<item_created_at>"
      }
    ],
    "deudas": {
      "<debtor_name>": {
        "<moroso_name>": <debt_amount>
      }
    }
  },
  "token": "<generated_new_token>"
}
``` 
- Status Code: 404 (Not Found) - If the item with the provided code is not found.

```json

{
  "message": "Item not found!"
}
``` 
5. **/items** :
- Description: This endpoint is used to add a new item to the existing item list.
- Method: POST 
- Request Headers: 
- `token`: A validation token obtained from the GET `/` endpoint or POST `/connect` endpoint. 
- Request Body:

```json

{
  "title": "<item_title>",
  "payer": "<payer_name>",
  "amount": <item_amount>,
  "debtors": ["debtor1", "debtor2", "..."]
}
``` 
- Response:
- Status Code: 200 (OK) 
- Response Body:

```json

{
  "message": "Item added!",
  "token": "<generated_new_token>"
}
``` 
- Status Code: 404 (Not Found) - If the item with the provided code is not found.

```json

{
  "message": "Item not found!"
}
```
### Headers: 
1. **validationtoken** : This header is used to pass the validation token, which is obtained from the GET `/` endpoint. It is used for authentication and authorization purposes. 
2. **code** : This header is used in the POST `/connect` endpoint to pass the item code to connect to the specific item. 
3. **token** : This header is used in various endpoints (`POST /connect`, `GET /items`, and `POST /items`) to pass the validation token obtained from the GET `/` endpoint or the POST `/connect` endpoint. It is used for authentication and authorization purposes.
### Request: 
1. **GET /** :
- The request to this endpoint does not require any specific data in the request body. 
2. **POST /create** : 
- The request to this endpoint requires the `names` array in the request body, which contains the names of the item. 
3. **POST /connect** :
- The request to this endpoint does not require any specific data in the request body. 
4. **GET /items** :
- The request to this endpoint does not require any specific data in the request body. 
5. **POST /items** : 
- The request to this endpoint requires the `title`, `payer`, `amount`, and `debtors` fields in the request body to add a new item.
### Response:

The responses for the different endpoints are provided in the "Endpoints" section above. The response always includes a `message` field, and the additional fields in the response depend on the endpoint called.
### Body: 
1. **ResponseType** : This type defines the structure of the response object returned by the API endpoints. It includes fields like `message`, `data`, `token`, `validationToken`, and `code`. 
2. **DataResponse** : This type defines the structure of the `data` field within the `ResponseType`. It includes fields like `deudas` and `itemsList`. 
3. **Deudas** : This type represents the structure of the debts data within the `data` field. It is a nested object where each person (`persona`) has associated debtors (`moroso`) and their corresponding debt amount. 
4. **ItemListItem** : This type represents the structure of the individual item in the `itemsList` array within the `data` field. It includes fields like `uuid`, `title`, `payer`, `amount`, `debtors`, and `createdAt`. 
5. **ItemBody** : This type represents the structure of the request body used in the `POST /items` endpoint. It includes fields like `title`, `payer`, `amount`, and `debtors`.

Please note that the provided code is just a sample, and actual functionality may depend on the implementation of the related services and models. Make sure to adapt and extend the code according to your specific requirements and business logic.