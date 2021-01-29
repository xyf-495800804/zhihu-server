const config = {
	userAttributes: ['name', 'email', 'avatarUrl', 'headline'],
	commentAttributes: ['id', 'creatorId', 'content', 'targetId'],
	articleAttributes: ['id', 'title', 'excerpt', 'content', 'cover', 'type'],
	questionAttributes: ['id', 'title', 'excerpt', 'discription', 'creatorId'],
	answerAttributes: [
		'id',
		'content',
		'excerpt',
		'creatorId',
		'type',
		'targetId',
	],
}

module.exports = config
