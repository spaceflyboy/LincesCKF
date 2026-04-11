# User
## UserID (Primary Key)
## FullName
## Email
## Password
## PhoneNumber
## AccountType

# Cart
## CartID (Primary Key)
## UserID (Foreign Key to User.UserID)
## Status (Maybe)
## Submission Date (Maybe)

# CartItem
## CartID
## ItemID
## Quantity
## Size (Nullable to support CatalogItems with HasSizes = 0)
## 
## (CartID, ItemID) Primary Key and both CartID and ItemID are also Foreign Keys (this is an Associative Entity)

# CatalogItem
## ItemID (Primary Key)
## ProductNameEnglish
## ProductNameSpanish
## DescriptionEnglish
## DescriptionSpanish
## Price
## HasSizes (boolean used to determine whether we show a size option)
## RelatedItemID (Foreign Key to another CatalogItem.ItemID)

# Review
## ReviewID (Primary Key)
## ReviewerFullName
## ItemID (Foreign Key to CatalogItem.ItemID)
## Rating
## ReviewTextEnglish
## ReviewTextSpanish

# ContactMessage
## MessageID (Primary Key)
## Name
## Email
## Subject
## Message
## SubmittedDateTime

# CustomOrder
## CustomOrderID (Primary Key)
## FullName
## EmailAddress
## GarmentType
## FabricPreference
## Measurements
## AdditionalDetails
