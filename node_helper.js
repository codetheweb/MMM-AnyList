const NodeHelper = require('node_helper');
const AnyList = require('anylist');

module.exports = NodeHelper.create({
	start() {
		console.log(`Starting node helper: ${this.name}`);
	},

	async socketNotificationReceived(notification, payload) {
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
	}
});
