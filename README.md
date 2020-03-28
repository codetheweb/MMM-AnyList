# MMM-AnyList

MMM-AnyList is a Magic Mirror Module for AnyList.

### Config

Example config:

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
		animationSpeed: 2000
  }
}
```

The last 3 optional parameters mirror those of the built-in calendar module.
