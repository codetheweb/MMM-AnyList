// eslint-disable-next-line no-undef
Module.register('MMM-AnyList', {
	defaults: {
		onlyShowUnchecked: true,
		maxItemsInList: 10,
		fade: true,
		fadePoint: 0.5,
		animationSpeed: 2000,
		highlightAlternateRows: false,
		highlightColor: 'darkslategrey'
	},

	start() {
		// Send user config to backend
		// Backend will reply with socket notification when ready
		this.sendSocketNotification('INIT', this.config);
	},

	getDom() {
		const wrapper = document.createElement('div');
		wrapper.className = 'anylist';

		if (!this.list) {
			// Data hasn't been loaded yet, return
			return wrapper;
		}

		// Create list title
		const listTitle = document.createElement('div');
		listTitle.innerHTML = this.list.name;
		listTitle.className = 'bright';
		wrapper.append(listTitle);

		// Create list item container
		const listContainer = document.createElement('ul');
		if (this.config.hideBullets) {
			listContainer.style.listStyleType = 'none';
		}
		wrapper.append(listContainer);

		// Add items to container
		this.list.items.forEach((item, i) => {
			const itemRow = document.createElement('li');
			itemRow.innerHTML = item.name;
			itemRow.className = 'light';
			itemRow.style.opacity = this.config.fade ? this._getFadedOpacity(this.list.items.length, i) : 1;

			if (i % 2 === 0 && this.config.highlightAlternateRows) {
				itemRow.style.backgroundColor = this.config.highlightColor;
			}

			listContainer.append(itemRow);
		});

		return wrapper;
	},

	socketNotificationReceived(notification, payload) {
		if (notification === 'LIST_DATA' && payload.name === this.config.list) {
			// Update local data
			let items = payload.items;

			if (this.config.onlyShowUnchecked) {
				items = items.filter(i => !i.checked);
			}

			if (this.config.maxItemsInList) {
				items = items.slice(0, this.config.maxItemsInList);
			}

			this.list = {...payload, items};

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
