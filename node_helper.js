const NodeHelper = require('node_helper');
const AnyList = require('anylist');

let calls = 0;

module.exports = NodeHelper.create({
	start() {
		console.log(`Starting node helper: ${this.name}`);
	},

	async socketNotificationReceived(notification, payload) {
		calls++;

		if (calls % 2 === 0) {
			await new Promise(resolve => setTimeout(resolve, 3000));
		}

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
