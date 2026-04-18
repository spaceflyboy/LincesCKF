## User
UserID (Primary Key)<br>
FullName<br>
Email<br>
Password<br>
PhoneNumber<br>
AccountType

## Cart
CartID (Primary Key)<br>
UserID (Foreign Key to User.UserID)<br>
Status<br>
Submission Date

## CartItem
CartID<br>
ItemID<br>
Quantity<br>
Size (Nullable to support CatalogItems with no sizes)<br>
### (CartID, ItemID) Primary Key and both CartID and ItemID are also Foreign Keys (this is an Associative Entity)

## CatalogItem
ItemID (Primary Key)<br>
ProductNameEnglish<br>
ProductNameSpanish<br>
DescriptionEnglish<br>
DescriptionSpanish<br>
Price<br>
RelatedItemID (Foreign Key to another CatalogItem.ItemID)

## Review
ReviewID (Primary Key)<br>
ReviewerFullName<br>
ItemID (Foreign Key to CatalogItem.ItemID)<br>
Rating<br>
ReviewTextEnglish<br>
ReviewTextSpanish

## ContactMessage
MessageID (Primary Key)<br>
Name<br>
Email<br>
Subject<br>
Message<br>
SubmittedDateTime

## CustomOrder
CustomOrderID (Primary Key)<br>
FullName<br>
EmailAddress<br>
GarmentType<br>
FabricPreference<br>
Measurements<br>
AdditionalDetails
