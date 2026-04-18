## Database calls we will need to make:

### Login: 
Fetch UserID from database by email/password and put into state for cart purposes

### Register: 
Create User record, probably also perform the "login" functionality but bypass email/password check to set up the state properly so a user can check out

### Checkout: 
Create Cart record and CartItem records tied to it and their respective CatalogItems - NEED a UserID from login action to tie the record properly

### Orders Page: 
Fetch cart records tied to current UserID, sort by submission date. This will show historical orders per user

### Contact Us: 
Submit form, database schema should contain just the fields we ask the user for apart from any splitting related to translation there might be.

### Custom Order: 
Submit form, very similar to "Contact Us" database action but using slightly different form and backend

### Product Detail:
Fetch reviews, sizes, related products data based on ItemID from the product that was clicked on
	
### Logout:
Doesn't need to talk to the database per se but should erase the UserID that is instantiated from login/registration.
