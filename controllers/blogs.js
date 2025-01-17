const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (request) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '')
	}
	return null
}

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('author', { username: 1, name: 1 })
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: 'token invalid' })
	}
	const user = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: body.title,
		author: user._id,
		url: body.url,
		likes: body.likes || 0,
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.status(201).json(savedBlog)
})

module.exports = blogsRouter
