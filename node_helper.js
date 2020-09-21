const NodeHelper = require('node_helper');
const AnyList = require('anylist');
const queue = require('async/queue');

module.exports = NodeHelper.create({
	start() {
		console.log(`Starting node helper: ${this.name}`);

		// Limit concurrency, otherwise we get errors when
		// loging in.
		this.queue = queue(async (task, callback) => {
			const {notification, payload} = task;

			if (notification === 'INIT') {
				const {email, password, list} = payload;

				this.anylist = new AnyList({email, password});

				// Send update when list is updated
				this.anylist.on('lists-update', () => {
					this.sendSocketNotification('LIST_DATA', this.anylist.getListByName(list));
				});

				await this.anylist.login();
				await this.anylist.getLists();

				this.sendSocketNotification('LIST_DATA', this.anylist.getListByName(list));
			}

			callback();
		}, 1);
	},

	async socketNotificationReceived(notification, payload) {
		this.queue.push({notification, payload});
	}
});
