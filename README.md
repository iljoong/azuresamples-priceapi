# Description

List of Azure Service Management API samples

1. Price (ratecard) API

    * API document: [https://msdn.microsoft.com/en-us/library/azure/mt219004.aspx](https://msdn.microsoft.com/en-us/library/azure/mt219004.aspx)

    * This sample app saves current Azure PAYG(MS-AZR-0003p) price into CSV format file, JSON format file or SQL Database

2. Usage API

    * API document: [https://msdn.microsoft.com/en-us/library/azure/mt219003.aspx](https://msdn.microsoft.com/en-us/library/azure/mt219003.aspx)

    * This sample app saves __usage___ into JSON format

3. Azure VM size in all regions

    * API document: [https://msdn.microsoft.com/en-us/library/azure/mt269440.aspx](https://msdn.microsoft.com/en-us/library/azure/mt269440.aspx)

    * This sample app saves __VM sizes in all regions__ into JSON format

# Setup & Run

1. Update `./config.js`

2. `npm install`

3. `node price` or `node usage` or `node vmsize`

# Table schema for SQL (Price API sample)

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
