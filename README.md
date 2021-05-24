# MMM-AnyList

MMM-AnyList is a Magic Mirror Module for [AnyList](https://www.anylist.com/).


## Screenshot
![screenshot](/anylist.png)


## Installation
Open a terminal session, navigate to your MagicMirror's `modules` folder and execute:
````
git clone https://github.com/codetheweb/MMM-AnyList.git
cd MMM-AnyList
npm install
````

Activate the module by adding it to the config.js file as shown below.


## Using the module
```javascript
{
  module: 'MMM-AnyList',
  position: 'top_left',
  config: {
    email: 'your-email',
    password: 'your-password',
    list: 'your-list-name',
    // Optional, values listed are the defaults
    onlyShowUnchecked: true,
    maxItemsInList: 10,
    fade: true,
    fadePoint: 0.5,
    animationSpeed: 2000,
    trimText: true,
    showCategories: true,
    showQuantities: true
  }
}
```

## Config
The entry in `config.js` can include the following options:

|Option|Description|Default Value|Accepted Values|
|---|---|---|---|
|`email`|*Required* Your AnyList email address|-|`Your email address`|
|`password`|*Required* Your AnyList password|-|`Your password`|
|`list`|*Required* The name of the list you want to display|-|`Your list name`|
|`onlyShowUnchecked`|Only show items not crossed off your list|`true`|`true / false`|
|`maxItemsInList`|The maximum number of items to display|`10`|`Any number (0 for unlimited)`|
|`fade`|Toggle to fade out list towards the end|`true`|`true / false`|
|`fadePoint`|Rate at which to fade out|`0.5`|`A number between 0 and 1`|
|`animationSpeed`|Speed for refresh animation|`2000`|`Any number (in milliseconds)`|
|`highlightAlternateRows`|Highlights every second row.  Not available when showing categories|`false`|`true / false`|
|`highlightColor`|The color to highlight|`darkslategrey`|`Any color value`|
|`trimText`|Trim any items more than 25 characters long to save space|`true`|`true / false`|
|`showCategories`|Use item categories as table headers|`true`|`true / false`|
|`showQuantities`|Show the quantity of each item from your list|`true`|`true / false`|


