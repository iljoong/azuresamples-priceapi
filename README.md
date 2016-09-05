# Description

Azure Price (ratecard) API sample

* [https://msdn.microsoft.com/en-us/library/azure/mt219004.aspx](https://msdn.microsoft.com/en-us/library/azure/mt219004.aspx)

# Setup & Run

1. Update `./config.js`

2. `npm install`

3. `npm start`

# Table schema for SQL

```sql
CREATE TABLE [dbo].[AzurePrice] (
    [Id]        NVARCHAR (256) NOT NULL,
    [Name]        NVARCHAR (256) NOT NULL,
    [Category]    NVARCHAR (256) NULL,
    [SubCategory] NVARCHAR (256) NULL,
    [Region]      NVARCHAR (256) NULL,
    [Unit]        NVARCHAR (256) NULL,
    [Rates]       FLOAT (53)     NULL
);
```
