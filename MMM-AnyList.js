// eslint-disable-next-line no-undef
Module.register('MMM-AnyList', {
	defaults: {
		onlyShowUnchecked: true,
		maxItemsInList: 10,
		fade: true,
		fadePoint: 0.5,
		animationSpeed: 2000,
		highlightAlternateRows: false,
		highlightColor: 'darkslategrey',
		trimText: true,
		showCategories: true,
		showQuantities: true
	},

	start() {
		// Send user config to backend
		// Backend will reply with socket notification when ready
		this.sendSocketNotification('INIT', this.config);
	},

	getHeader() {
		return this.data.header;
	},

	getDom() {
		const wrapper = document.createElement('div');
		wrapper.className = 'anylist';

		if (!this.list) {
			// Data hasn't been loaded yet, return
			wrapper.innerHTML = 'Loading …';
			wrapper.className = 'small dimmed';
			return wrapper;
		}

		// Set list header to module header
		this.data.header = this.list.name;

		// Create table container
		const tableContainer = document.createElement('table');
		tableContainer.className = 'small';

		let category = '';

		// Add items to container
		this.list.items.forEach((item, i) => {
			// Create header cell if current item is in a different category than the previous item
			if (item.categoryMatchId !== category && this.config.showCategories) {
				const header = document.createElement('th');

				const toUpper = item.categoryMatchId[0].toUpperCase() + item.categoryMatchId.slice(1); // Make first letter upper case
				const format = toUpper.replace(/-/g, ' '); // Replace hyphens with spaces

				if (i > 0) {
					header.style.paddingTop = '12px';
				} // Add padding if not the first category

				header.innerHTML = format;
				tableContainer.append(header);

				category = item.categoryMatchId;
			}

			const itemRow = document.createElement('tr');

			const itemCellName = document.createElement('td');
			if (item.name.length > 25 && this.config.trimText) {
				itemCellName.innerHTML = item.name.slice(0, 24) + '…';
			} else {
				itemCellName.innerHTML = item.name;
			}

			itemRow.append(itemCellName);

			if (this.config.showQuantities) {
				const itemCellQuantity = document.createElement('td');
				itemCellQuantity.innerHTML = item.quantity || 1;
				itemCellQuantity.style.width = '50px';
				itemCellQuantity.style.textAlign = 'right';
				itemRow.append(itemCellQuantity);
			}

			if (i % 2 === 0 && this.config.highlightAlternateRows && !this.config.showCategories) {
				itemRow.style.backgroundColor = this.config.highlightColor;
			}

			tableContainer.append(itemRow);
		});

		wrapper.append(tableContainer);

		return wrapper;
	},

	socketNotificationReceived(notification, payload) {
		if (notification === 'LIST_DATA' && payload.name === this.config.list) {
			// Update local data
			let items = payload.items;

			if (this.config.onlyShowUnchecked) {
				items = items.filter(i => !i.checked);
			}

			if (this.config.maxItemsInList > 0) {
				items = items.slice(0, this.config.maxItemsInList);
			}

			const list = {...payload, items};

			list.items.sort((a, b) => a.categoryMatchId.localeCompare(b.categoryMatchId)); // Sort items into category groups

			this.list = list;

			// Update display
			this.updateDom(this.config.animationSpeed);
		}
	},

	getStyles() {
		return ['MMM-AnyList.css'];
	},

	_getFadedOpacity(length_, i, startPercentage = this.config.fadePoint) {
		// Calculates the opacity of an item in a list
		// given a percentage at which to start fading out.
		const startIndex = length_ * startPercentage;
		const fadeSteps = length_ - startIndex;

		if (i >= startIndex) {
			const currentFadeStep = i - startIndex;
			return 1 - (1 / fadeSteps * currentFadeStep);
		}

		return 1;
	}
});
