const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.length === 0
		? 0
		: blogs.reduce((sum, value) => sum + value.likes, 0)
}

const favouriteBlog = (blogs) => {
	return blogs.reduce((a, b) => (a.likes > b.likes ? a : b))
}

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
}
