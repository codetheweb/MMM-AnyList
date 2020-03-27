// Constants
const UPDATE_ANIMATION_DURATION_MS = 500;
const MAX_ITEMS_IN_LIST = 10;
const START_FADE_POSITION = 0.25; // Percentage

// eslint-disable-next-line no-undef
Module.register('MMM-AnyList', {
	defaults: {},

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
		wrapper.append(listContainer);

		// Add items to container
		this.list.items.forEach((item, i) => {
			const itemRow = document.createElement('li');

			itemRow.innerHTML = item.name;
			itemRow.className = 'light';
			itemRow.style.opacity = this._getFadedOpacity(this.list.items.length, i);

			listContainer.append(itemRow);
		});

		return wrapper;
	},

	socketNotificationReceived(notification, payload) {
		if (notification === 'LIST_DATA') {
			// TODO: what should happen for large lists?
			// Update local data
			this.list = {...payload, items: payload.items.slice(0, MAX_ITEMS_IN_LIST)};

			// Update display
			this.updateDom(UPDATE_ANIMATION_DURATION_MS);
		}
	},

	getStyles() {
		return ['MMM-AnyList.css'];
	},

	_getFadedOpacity(length_, i, startPercentage = START_FADE_POSITION) {
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
