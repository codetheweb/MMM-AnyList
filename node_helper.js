const NodeHelper = require('node_helper');
const AnyList = require('anylist');
const queue = require('async/queue');

module.exports = NodeHelper.create({
	start() {
		const self = this;

		console.log(`Starting node helper: ${this.name}`);

		// Limit concurrency, otherwise we get errors when
		// logging in.
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

		this.queue.error((err, task) => {
			const message = `AnyList module experienced an error while processing a ${task.notification} notification: ${err}`;
			console.error(message);
			self.sendSocketNotification('ANYLIST_ERROR', message);
		});
	},

	async socketNotificationReceived(notification, payload) {
		this.queue.push({notification, payload});
	}
});
